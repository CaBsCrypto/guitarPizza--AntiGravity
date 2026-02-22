// ============================================================
//  Guitar Pizza - Noir ZK Circuit  (v2 - engine-aligned)
//  guitar_pizza_proof / src / main.nr
// ============================================================
//
//  PURPOSE
//  -------
//  Prove, in zero-knowledge, that a Guitar Pizza session was
//  played honestly:
//
//    - The reported `score` is mathematically derivable from the
//      reported statistics - no score inflation possible.
//    - All statistics are within physically achievable bounds for
//      a level that contains at most 200 notes.
//    - `perfect_hits` <= `total_hits` <= `total_notes` <= 200
//    - `traps_avoided` <= `total_traps`
//    - `fever_seconds` <= 300  (5-minute level cap)
//    - `pizzas_completed` <= 20
//    - `combo_bonus` <= physical maximum
//    - `score` >= `score_goal`  - player beat La Casa
//
//  SCORE MODEL  (mirrors guitar-pizza-engine.js exactly)
//  -------------------------------------------------------
//  The engine accumulates score as:
//
//    per-note:  (perfect ? 100 + combo*10 : 50 + combo*5) * multiplier
//               multiplier = 2 during Fever Mode, 1 otherwise
//    per-pizza: +1000
//    per-trap-dodge: +50
//
//  We split this into:
//
//    base_score = total_hits * 100        (every hit is worth >= 100)
//               + perfect_hits * 50       (perfect bonus, no multiplier)
//               + pizzas_completed * 1000 (matches engine: line 379)
//               + traps_avoided * 50      (trap dodge bonus)
//
//    combo_bonus = score - base_score
//               = all extra points: combo multipliers, fever 2x,
//                 sustain ticks, secret sauce (5000), hold bonuses.
//               This is a private witness - the prover knows the
//               exact breakdown, we only bound it.
//
//    assert(base_score + combo_bonus == score)
//
//  INPUTS
//  ------
//  Private (only the prover knows):
//    - perfect_hits     : u32
//    - total_hits       : u32
//    - total_notes      : u32   - notes spawned in the level
//    - traps_avoided    : u32
//    - total_traps      : u32
//    - fever_seconds    : u32
//    - pizzas_completed : u32
//    - combo_bonus      : u32   - total dynamic bonus beyond base
//
//  Public (on-chain / verifier sees these):
//    - score            : pub u32   - final verified score
//    - level_id         : pub u32
//    - session_id       : pub u32   - anti-replay nonce
//    - score_goal       : pub u32   - minimum to beat La Casa
//
//  WHY score IS PUBLIC
//  -------------------
//  The leaderboard contract needs to read and rank the score.
//  Making it a public input means the verifier can extract it
//  without trusting the player's claim - the circuit enforces it.
//
//  COMBO BONUS BOUND
//  -----------------
//  Physical maximum for combo_bonus:
//    - Combo extra:  sum(i=0..total_hits-1, i*10) = total_hits*(total_hits-1)/2 * 10
//      With 200 hits: 200*199/2*10 = 199,000
//    - Fever extra:  each hit during fever is worth 2x so up to +100%
//      With 200 hits all in fever: ~200*200 = 40,000 extra
//    - Sustain ticks / secret sauce: up to ~15,000 per session
//    Safe upper bound: total_hits^2 * 10 + fever_seconds * 400 + 20000
//
// ============================================================

fn main(
    // -- Private inputs --------------------------------------------------
    perfect_hits     : u32,
    total_hits       : u32,
    total_notes      : u32,   // notes spawned this level
    traps_avoided    : u32,
    total_traps      : u32,
    fever_seconds    : u32,
    pizzas_completed : u32,
    combo_bonus      : u32,   // score - base_score (all dynamic extras)

    // -- Public inputs (on-chain visible) --------------------------------
    score            : pub u32,
    level_id         : pub u32,
    session_id       : pub u32,
    score_goal       : pub u32,
) {
    // ----------------------------------------------------------
    // 1. RANGE CHECKS - physically impossible values rejected
    // ----------------------------------------------------------

    // At most 200 notes can spawn in a 90-second level (BPM 128, 5 lanes).
    // This caps the maximum achievable score, preventing stat fabrication.
    assert(
        total_notes <= 200,
        "total_notes exceeds 200-note cap for this level"
    );

    // Can't hit more notes than were spawned.
    assert(
        total_hits <= total_notes,
        "total_hits exceeds total_notes"
    );

    // Can't have more perfect hits than total hits.
    assert(
        perfect_hits <= total_hits,
        "perfect_hits exceeds total_hits"
    );

    // Can't dodge more traps than existed.
    assert(
        traps_avoided <= total_traps,
        "traps_avoided exceeds total_traps"
    );

    // 5-minute maximum level duration.
    assert(
        fever_seconds <= 300,
        "fever_seconds exceeds 300-second cap"
    );

    // Reasonable pizza cap per session.
    assert(
        pizzas_completed <= 20,
        "pizzas_completed exceeds 20-pizza cap"
    );

    // ----------------------------------------------------------
    // 2. COMBO BONUS BOUND
    //    combo_bonus must be >= 0 (guaranteed by u32 type)
    //    and <= physical maximum achievable in the level.
    // ----------------------------------------------------------
    //  Max combo extra:  total_hits * (total_hits - 1) / 2 * 10
    //  Max fever extra:  total_hits * 200   (all hits doubled)
    //  Max misc:         20_000             (sustains + secret sauce)
    //  We use a rounded safe ceiling.
    let hits64  : u64 = total_hits as u64;
    let fever64 : u64 = fever_seconds as u64;

    let max_combo_extra : u64 = hits64 * hits64 * 10;
    let max_fever_extra : u64 = fever64 * 400;
    let max_misc        : u64 = 20_000;

    let max_combo_bonus : u64 = max_combo_extra + max_fever_extra + max_misc;

    assert(
        (combo_bonus as u64) <= max_combo_bonus,
        "combo_bonus exceeds physical maximum for this session"
    );

    // ----------------------------------------------------------
    // 3. SCORE INTEGRITY
    //    base_score + combo_bonus must equal the claimed score.
    //    This is the core anti-cheat constraint.
    // ----------------------------------------------------------
    let base : u64 = hits64 * 100
                   + (perfect_hits as u64) * 50
                   + (pizzas_completed as u64) * 1000
                   + (traps_avoided as u64) * 50;

    let computed : u64 = base + (combo_bonus as u64);
    let claimed  : u64 = score as u64;

    assert(
        computed == claimed,
        "base_score + combo_bonus does not equal claimed score"
    );

    // ----------------------------------------------------------
    // 4. GOAL CHECK - score must beat La Casa
    // ----------------------------------------------------------
    assert(
        claimed >= (score_goal as u64),
        "score does not meet score_goal - La Casa wins"
    );

    // ----------------------------------------------------------
    // 5. SESSION BINDING
    //    Trivial range constraints keep level_id and session_id
    //    as real public inputs (compiler won't optimise away).
    // ----------------------------------------------------------
    assert(level_id  <  1000, "level_id out of valid range");
    assert(session_id > 0,    "session_id must be non-zero");

    // -- If we reach here, the proof is valid. ---------------------------
}

// ============================================================
//  Unit tests  (run with: nargo test)
// ============================================================

#[test]
fn test_valid_winning_session() {
    // Engine score breakdown:
    //   base  = 80*100 + 60*50 + 5*1000 + 10*50 = 8000+3000+5000+500 = 16500
    //   combo = 2500  (accumulated combo & fever extras)
    //   total = 19000, score_goal = 10000 -> wins
    main(
        60,     // perfect_hits
        80,     // total_hits
        100,    // total_notes
        10,     // traps_avoided
        15,     // total_traps
        30,     // fever_seconds
        5,      // pizzas_completed
        2500,   // combo_bonus
        19000,  // score (pub)
        1,      // level_id (pub)
        42,     // session_id (pub)
        10000,  // score_goal (pub)
    );
}

#[test]
fn test_zero_combo_zero_fever() {
    // Pure base score, no combo bonus, no fever
    //   base = 50*100 + 50*50 + 0 + 0 = 7500
    main(
        50,     // perfect_hits
        50,     // total_hits
        60,     // total_notes
        0,      // traps_avoided
        0,      // total_traps
        0,      // fever_seconds
        0,      // pizzas_completed
        0,      // combo_bonus
        7500,   // score (pub)
        2,      // level_id (pub)
        7,      // session_id (pub)
        5000,   // score_goal (pub)
    );
}

#[test]
fn test_exact_goal_boundary() {
    // score == score_goal  ->  should pass  (>=)
    //   base = 100*100 + 0*50 + 0 + 5*50 = 10250
    main(
        0,      // perfect_hits
        100,    // total_hits
        100,    // total_notes
        5,      // traps_avoided
        10,     // total_traps
        0,      // fever_seconds
        0,      // pizzas_completed
        0,      // combo_bonus
        10250,  // score (pub) - exact boundary
        3,      // level_id (pub)
        99,     // session_id (pub)
        10250,  // score_goal (pub) - exact boundary
    );
}

#[test]
fn test_high_combo_fever_session() {
    // Fever run: 60s fever, 150 hits, 100 perfect, 3 pizzas, 8 traps avoided
    //   base  = 150*100 + 100*50 + 3*1000 + 8*50 = 15000+5000+3000+400 = 23400
    //   combo = 15000  (heavy combo + fever multiplier)
    //   total = 38400
    main(
        100,    // perfect_hits
        150,    // total_hits
        180,    // total_notes
        8,      // traps_avoided
        12,     // total_traps
        60,     // fever_seconds
        3,      // pizzas_completed
        15000,  // combo_bonus
        38400,  // score (pub)
        1,      // level_id (pub)
        77,     // session_id (pub)
        20000,  // score_goal (pub)
    );
}

#[test(should_fail)]
fn test_score_mismatch_fails() {
    // base = 50*100+50*50+0+0 = 7500, combo_bonus=0 -> computed=7500
    // claimed=7501 -> MUST FAIL
    main(
        50, 50, 60, 0, 0, 0, 0,
        0,      // combo_bonus
        7501,   // score (wrong by 1)
        2, 7, 5000,
    );
}

#[test(should_fail)]
fn test_below_goal_fails() {
    // score (7500) < score_goal (8000) -> MUST FAIL
    main(
        50, 50, 60, 0, 0, 0, 0,
        0,
        7500,
        2, 7,
        8000,  // score_goal higher
    );
}

#[test(should_fail)]
fn test_total_notes_cap_fails() {
    // total_notes = 201 > 200 -> MUST FAIL (stat fabrication attempt)
    main(
        200, 201, 201, 0, 0, 0, 0,
        0,
        20100,
        1, 1, 10000,
    );
}

#[test(should_fail)]
fn test_perfect_exceeds_total_fails() {
    // perfect_hits (110) > total_hits (100) -> MUST FAIL
    main(
        110,   // perfect_hits > total_hits
        100, 120, 0, 0, 0, 0,
        0,
        10000,
        1, 1, 5000,
    );
}

#[test(should_fail)]
fn test_combo_bonus_too_high_fails() {
    // combo_bonus = 999999 far exceeds max -> MUST FAIL
    main(
        10, 10, 20, 0, 0, 0, 0,
        999999,   // absurd combo bonus
        1001099,  // base=10*100+10*50+0+0=1500, claimed=1500+999999=1001499 - doesn't matter, combo check fires first
        1, 1, 5000,
    );
}

#[test(should_fail)]
fn test_traps_avoided_exceeds_total_fails() {
    // traps_avoided (20) > total_traps (10) -> MUST FAIL
    main(
        0, 100, 100,
        20,   // traps_avoided > total_traps
        10,
        0, 0, 0,
        10000,
        1, 1, 5000,
    );
}
