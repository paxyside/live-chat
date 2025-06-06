import React from "react";
import styles from "./ChatLayout.module.css";
import {ErrorMessage} from "@/components/ErrorMessage";

interface AuthLayoutProps {
  error: string | null;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({error}) => (
  <div className={styles.container}>
    <header>
      <ErrorMessage error={error}/>
    </header>
  </div>
);

export default AuthLayout;