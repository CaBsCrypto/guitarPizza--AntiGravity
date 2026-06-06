import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Friend {
    address: string;
    alias: string;
    addedAt: number;
}

export interface FriendsState {
    friends: Friend[];
    addFriend: (address: string, alias: string) => void;
    removeFriend: (address: string) => void;
}

export const useFriendsStore = create<FriendsState>()(
    persist(
        (set) => ({
            friends: [],
            addFriend: (address, alias) =>
                set((state) => {
                    // Avoid duplicates
                    if (state.friends.some((f) => f.address === address)) return state;
                    return {
                        friends: [...state.friends, { address, alias, addedAt: Date.now() }],
                    };
                }),
            removeFriend: (address) =>
                set((state) => ({
                    friends: state.friends.filter((f) => f.address !== address),
                })),
        }),
        {
            name: 'guitarpizza-famiglia-storage', // unique name for localStorage key
        }
    )
);
