import { useState } from "react";

export default function useSidePanel() {
    const [ panelOpen, setPanelOpen] = useState(false);
    const [ panelInfo, setPanelInfo ] = useState({
        header: 'Placeholder',
        content: [],
        actions: [],
    });

    const setPanel = (info, reOpen = true) => {
        setPanelOpen(false);
        setTimeout(() => {
            setPanelInfo(info);
            if (reOpen) setPanelOpen(true);
        }, 200);
    }

    return {panelOpen, setPanelOpen, panelInfo, setPanelInfo, setPanel};
}