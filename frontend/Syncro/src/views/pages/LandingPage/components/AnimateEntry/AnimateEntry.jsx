import { InView } from "react-intersection-observer";
import "./AnimateEntry.css";

export default function AnimateEntry({ children }) {
    return (
        <InView triggerOnce>
            {({ inView, ref }) => (
                <div className={'AnimateEntry ' + (inView ? 'visible' : 'invisible')} ref={ref}>
                    {children}
                </div>
            )}
        </InView>
    );
}