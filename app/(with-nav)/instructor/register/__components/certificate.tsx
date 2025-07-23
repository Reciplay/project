import BaseInput from "@/components/input/baseInput";
import styles from "./certificate.module.scss";

export default function Certificate() {
    return (
        <div>
            <span className={styles.title}>자격증</span>
            <hr />
            <div className={styles.inputContainer}>
                <BaseInput
                    placeholder="자격증명"
                    type="custom"
                />
                <BaseInput
                    placeholder="발행처/기관"
                    type="custom"
                />
            </div>

        </div>
    )
}