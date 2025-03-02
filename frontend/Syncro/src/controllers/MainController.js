/**
 * React doesn't really work with a standard MVC like a vanilla js app
 * 
 * The purpose of this file is to keep a global state 
 * that can be reference to synchronize behaviour between
 * different components and expose certain functions to keep
 * this global logic separated from the component logic
 * 
 * For example keeping track if a user is logged in 
 * to render one component or another without needing to fetch again? //TODO
 */

import { useContext } from "react";

function MainController() {
    const useMainController = () => {
        return useContext();
    }

    
}

/**
 * switch signal 
 * case "isUserLoggedIn"
 *  if userStatus !== null
 *      return userStatus
 *  else
 *   fetch user status
 *   return user status
 */
