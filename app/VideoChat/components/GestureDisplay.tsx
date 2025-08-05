import styles from './GestureDisplay.module.css';

type GestureDisplayProps = {
  gesture: string;
};

const GestureDisplay = ({ gesture }: GestureDisplayProps) => {
  return (
    <div className={styles.container}>
      <h4>Detected Gesture</h4>
      <p>{gesture || 'None'}</p>
    </div>
  );
};

export default GestureDisplay;
