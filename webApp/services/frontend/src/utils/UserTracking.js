import LogRocket from "logrocket";
import ReactGA from "react-ga";
import uuidv4 from "uuid/v4";
import {GOOGLE_ANALYTICS_TRACKING_CODE, IS_PRODUCTION} from "config";

const USER_ID_KEY = "userId";

export const getUserId = () => {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = uuidv4();
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
};

export const initLogRocket = () => {
    if (IS_PRODUCTION) {
        const userId = getUserId();

        LogRocket.init("dilgess/dank-meme-classifier");
        LogRocket.identify(userId);
    }
};

export const initGoogleAnalytics = () => {
    if (IS_PRODUCTION) {
        const userId = getUserId();

        ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE);
        ReactGA.pageview(window.location.pathname + window.location.search);
        ReactGA.set({userId});
    }
};

export const registerGAEvent = (properties) => {
    if (IS_PRODUCTION) {
        ReactGA.event(properties);
    }
};
