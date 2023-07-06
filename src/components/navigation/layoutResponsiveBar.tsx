import {ResponsiveBar} from "./ResponsiveBar";

const ResponsiveBarLayout = ({children}: { children: React.ReactNode, }) => {

  return (
    <>
      <ResponsiveBar/>
      {children}
    </>
  )
}

export default ResponsiveBar;
