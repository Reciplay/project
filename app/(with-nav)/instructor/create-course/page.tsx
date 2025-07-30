import Create from "./__components/create/create";
import styles from "./page.module.scss";

export default function Page() {

    return (
        <div className={styles.container}>
            <Create />
        </div>
    );
}
