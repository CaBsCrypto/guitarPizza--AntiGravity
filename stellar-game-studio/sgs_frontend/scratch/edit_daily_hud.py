import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the outer container
target_container = """                            <div style={{
                                width: '87%',
                                maxWidth: '300px',
                                marginTop: '0.3rem',
                                marginBottom: '-0.3rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.2rem',
                            }}>"""

replacement_container = """                            <div style={{
                                width: '87%',
                                maxWidth: '300px',
                                marginTop: '0.3rem',
                                marginBottom: '-0.3rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.4rem',
                                background: 'rgba(15, 8, 8, 0.9)',
                                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                                borderRadius: '12px',
                                padding: '0.5rem 0.6rem 0.6rem',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75)',
                                backdropFilter: 'blur(6px)',
                            }}>"""

# 2. Update Streak Row background, border, padding, and labels
target_streak = """                                        background: canCheckIn
                                            ? 'linear-gradient(90deg, rgba(139,0,0,0.85), rgba(212,175,55,0.25))'
                                            : 'rgba(0,0,0,0.3)',
                                        border: canCheckIn ? '1.5px solid #d4af37' : '1.5px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '0.25rem 0.6rem',"""

replacement_streak = """                                        background: canCheckIn
                                            ? 'linear-gradient(90deg, rgba(139,0,0,0.5), rgba(212,175,55,0.15))'
                                            : 'rgba(255,255,255,0.03)',
                                        border: canCheckIn ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '0.3rem 0.6rem',"""

# 3. Update Streak Label
target_label = """                                            <div style={{ fontSize: '0.6rem', color: '#d4af37', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>"""
replacement_label = """                                            <div style={{ fontSize: '0.62rem', color: '#d4af37', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 'bold' }}>"""

# 4. Update Signed checkmark
target_signed = """                                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>"""
replacement_signed = """                                            <div style={{ fontSize: '0.62rem', color: '#2ecc71', fontFamily: 'monospace', fontWeight: 'bold' }}>"""

# 5. Update Quest Row container
target_quest_row = """                                        <div
                                            key={idx}
                                            onClick={() => completed && !claimed ? claimQuestReward(idx) : undefined}
                                            style={{
                                                background: claimed ? 'rgba(39,174,96,0.08)' : completed ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.3)',
                                                border: claimed ? '1px solid rgba(39,174,96,0.4)' : completed ? '1px solid rgba(212,175,55,0.6)' : '1px solid rgba(255,255,255,0.07)',
                                                borderRadius: '6px',
                                                padding: '0.18rem 0.5rem',
                                                cursor: completed && !claimed ? 'pointer' : 'default',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >"""

replacement_quest_row = """                                        <div
                                            key={idx}
                                            onClick={() => completed && !claimed ? claimQuestReward(idx) : undefined}
                                            style={{
                                                background: claimed ? 'rgba(46,204,113,0.06)' : completed ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                                                border: claimed ? '1px solid rgba(46,204,113,0.35)' : completed ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                                borderRadius: '6px',
                                                padding: '0.25rem 0.5rem',
                                                cursor: completed && !claimed ? 'pointer' : 'default',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >"""

# 6. Update Quest label colors & fonts
target_quest_label = """                                                <span style={{ fontSize: '0.58rem', color: claimed ? '#27ae60' : completed ? '#d4af37' : 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>"""
replacement_quest_label = """                                                <span style={{ fontSize: '0.62rem', color: claimed ? '#2ecc71' : completed ? '#d4af37' : '#ffffff', fontWeight: '500', fontFamily: 'monospace' }}>"""

# 7. Update Quest progress labels
target_quest_val = """                                                <span style={{
                                                    fontSize: '0.58rem',
                                                    fontWeight: 'bold',
                                                    color: claimed ? '#27ae60' : completed ? '#d4af37' : 'rgba(255,255,255,0.4)',
                                                    fontFamily: 'monospace'
                                                }}>"""
replacement_quest_val = """                                                <span style={{
                                                    fontSize: '0.62rem',
                                                    fontWeight: 'bold',
                                                    color: claimed ? '#2ecc71' : completed ? '#d4af37' : '#ffffff',
                                                    fontFamily: 'monospace'
                                                }}>"""

# 8. Update Quest progress bar container
target_progress_bg = """                                            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>"""
replacement_progress_bg = """                                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>"""

# 9. Update Quest Reward
target_quest_reward = """                                            {completed && !claimed && (
                                                <div style={{ fontSize: '0.55rem', color: '#d4af37', textAlign: 'right', marginTop: '0.05rem', fontFamily: 'monospace' }}>
                                                    🎁 {questRewards[idx]}
                                                </div>
                                            )}"""
replacement_quest_reward = """                                            {completed && !claimed && (
                                                <div style={{ fontSize: '0.58rem', color: '#d4af37', textAlign: 'right', marginTop: '0.1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                    🎁 {questRewards[idx]}
                                                </div>
                                            )}"""

# Replace all occurrences cleanly
replacements = [
    (target_container, replacement_container),
    (target_streak, replacement_streak),
    (target_label, replacement_label),
    (target_signed, replacement_signed),
    (target_quest_row, replacement_quest_row),
    (target_quest_label, replacement_quest_label),
    (target_quest_val, replacement_quest_val),
    (target_progress_bg, replacement_progress_bg),
    (target_quest_reward, replacement_quest_reward)
]

for t, r in replacements:
    # Remove any extra carriage returns to make sure it matches
    t_clean = t.replace("\r", "")
    content_clean = content.replace("\r", "")
    if t_clean in content_clean:
        content = content_clean.replace(t_clean, r.replace("\r", ""))
        print(f"Substituted: {t[:40]}...")
    else:
        print(f"Warning: Could not match target block: {t[:40]}...")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done modifying daily HUD styling.")
