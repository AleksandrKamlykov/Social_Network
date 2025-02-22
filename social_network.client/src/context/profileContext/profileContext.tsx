import React, { createContext, useContext, useState, useEffect, useMemo, use } from 'react';
import { useParams } from 'react-router-dom';
import { useRequestData } from '@/Shared/api/useRequestData';
import { IUser } from '@/Enteties/user/types';
import { useAppSelector } from '@/App/store/AppStore';

interface ProfileContextProps {
    profile: IUser | null;
    loading: boolean;
    IS_SAME: boolean;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const { nickname } = useParams();
    const { data: profile, get, loading } = useRequestData<IUser>();
    const { nickname: userNickame } = useAppSelector(state => state.user);


    useEffect(() => {
        if (nickname) {
            get(`User/getByNickname/${nickname}`);
        }
    }, [nickname]);

    const IS_SAME = useMemo(() => {
        console.log('same', nickname, profile?.nickname);
        return profile?.nickname === userNickame;
    }
        , [nickname, profile, userNickame]);

    return (
        <ProfileContext.Provider value={{ profile, loading, IS_SAME }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = (): ProfileContextProps => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};