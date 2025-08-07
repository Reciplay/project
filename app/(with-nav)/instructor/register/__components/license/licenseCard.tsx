import styles from "./licenseCard.module.scss";

interface LicenseCardProps {
    name: string;
    institution: string;
    date: string;
}

export default function LicenseCard({ name, institution, date }: LicenseCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.title}>{name}</div>
            <div className={styles.institution}>{institution}</div>
            <div className={styles.date}>{date}</div>
        </div>
    );
}
