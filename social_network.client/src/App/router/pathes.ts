export const pathes = {
    home: {
        id: "home",
        relative: "/home",
        absolute: "/home"
    },
    profile: {
        id: "profile",
        relative: "profile/:ldap",
        absolute: "/profile/{{ldap}}",
        rating: {
            id: "profileRating",
            relative: "rating",
            absolute: "/profile/{{ldap}}/rating"
        },
  
    },
    admin: {
        id: "admin",
        relative: "admin",
        absolute: "/admin"
    },

    auth: {
        id: "auth",
        relative: "auth",
        absolute: "/auth"
    }
} as const;