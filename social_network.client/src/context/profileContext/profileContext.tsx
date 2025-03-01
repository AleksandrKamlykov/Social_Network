import React, { createContext, useContext, useState, useEffect, useMemo, use } from 'react';
import { useParams } from 'react-router-dom';
import { useRequestData } from '@/Shared/api/useRequestData';
import { IUser } from '@/Enteties/user/types';
import { useAppSelector } from '@/App/store/AppStore';
import {useRequest} from "@/Shared/api/useRequest.ts";

interface ProfileContextProps {
    profile: IUser | null;
    loading: boolean;
    IS_SAME: boolean;
    updateAvatar:(avatar:string)=>void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const { nickname } = useParams();
    const {  get, loading } = useRequest<IUser>();
    const { nickname: userNickame } = useAppSelector(state => state.user);

    const [profile, setProfile] = useState<IUser | null>(null);

async function fetchProfile(nickname: string) {
        const res = await get(`User/getByNickname/${nickname}`);
        if (res.data && res.status === 200) {
            setProfile(res.data);
        }
}


    useEffect(() => {
        if (nickname) {
          fetchProfile(nickname);
        }
    }, [nickname]);

    const IS_SAME = useMemo(() => {
        console.log('same', nickname, profile?.nickname);
        return profile?.nickname === userNickame;
    }
        , [nickname, profile, userNickame]);

    function updateAvatar(avatar:string){
        setProfile((prev)=> prev ?({...prev,avatar}) : null)
    }

    return (
        <ProfileContext.Provider value={{ profile, loading, IS_SAME,updateAvatar }}>
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