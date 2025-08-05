import { useInstructorStore } from "@/stores/instructorStore";
import LicenseCard from "./licenseCard";
import styles from "./licenseList.module.scss";

export default function List() {
    const { certificates } = useInstructorStore();

    return (
        <div className={styles.listWrapper}>
            {certificates.map((cert, index) => (
                <LicenseCard
                    key={index}
                    name={cert.licenseName}
                    institution={cert.institution}
                    date={cert.acquisitionDate}
                />
            ))}
        </div>
    );
}
