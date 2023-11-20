import React from "react";
import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell,
} from "@novu/notification-center";
import { useNavigate } from "react-router-dom";

const Notify = () => {
    const navigate = useNavigate();

    const onNotificationClick = (notification) =>
        navigate(notification.cta.data.url);

    return (
        <div>
            <NovuProvider
                subscriberId='<6558f575484eeeb4aa1873d8>'
                applicationIdentifier='<UXJyhaXMUp_l>'
            >
                <PopoverNotificationCenter
                    onNotificationClick={onNotificationClick}
                    colorScheme='light'
                >
                    {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
                </PopoverNotificationCenter>
            </NovuProvider>
        </div>
    );
};

export default Notify;