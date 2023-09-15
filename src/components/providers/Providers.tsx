import { FC } from "react";
import ModalProvider from "./ModalProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ModalProvider />
        <Toaster />
        {children}
      </ThemeProvider>
    </>
  );
};

export default Providers;
