'use client'

import Navigation from "../../src/components/navigation/Navigation";

export default function DriveLayout({children}: { children: JSX.Element }) {
    return (
        <>
            <Navigation>
                {children}
            </Navigation>
        </>
    )
}
