import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Friend {
    address: string;
    alias: string;
    addedAt: number;
    note?: string;
}

export interface FriendsState {
    friends: Friend[];
    addFriend: (address: string, alias: string, note?: string) => void;
    removeFriend: (address: string) => void;
    updateFriendNote: (address: string, note: string) => void;
}

export const useFriendsStore = create<FriendsState>()(
    persist(
        (set) => ({
            friends: [],
            addFriend: (address, alias, note) =>
                set((state) => {
                    // Avoid duplicates
                    if (state.friends.some((f) => f.address === address)) return state;
                    return {
                        friends: [...state.friends, { address, alias, addedAt: Date.now(), note }],
                    };
                }),
            removeFriend: (address) =>
                set((state) => ({
                    friends: state.friends.filter((f) => f.address !== address),
                })),
            updateFriendNote: (address, note) =>
                set((state) => ({
                    friends: state.friends.map((f) => f.address === address ? { ...f, note } : f),
                })),
        }),
        {
            name: 'guitarpizza-famiglia-storage', // unique name for localStorage key
        }
    )
);
