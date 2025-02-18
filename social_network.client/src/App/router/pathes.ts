export const pathes = {
    home: {
        id: "home",
        relative: "/home",
        absolute: "/home"
    },
    profile: {
        id: "profile",
        relative: "profile/:nickname",
        absolute: "/profile/{{nickname}}",
   
  
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
    },
    registration:{
        id: "registration",
        relative: "registration",
        absolute: "/registration"
    },
    users:{
        id: "users",
        relative: "users",
        absolute: "/users"
    }
} as const;