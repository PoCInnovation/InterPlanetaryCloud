import {Metadata} from "next";
import Provider from "./provider";


export const metadata: Metadata = {
    title: 'InterPlanetaryCloud',
    description: 'A distributed cloud built on top of Aleph, the next generation network of distributed big data applications.',
    icons: {
        icon: '/ipc-logo.svg'
    },
    viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({children}: { children: React.ReactNode }) {

    return (
        <html lang="en">
        <body>
        <Provider>
            {children}
        </Provider>
        </body>
        </html>
    );
}
