import { POSE_LANDMARK_NAMES } from '../lib/poseLandmarkNames';
import styles from './NodeDisplay.module.css';

type Node = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

type NodeDisplayProps = {
  nodes: Node[];
};

const NodeDisplay = ({ nodes }: NodeDisplayProps) => {
  return (
    <div className={styles.container}>
      <h4>Detected Nodes</h4>
      <ul>
        {nodes.map((node, index) => (
          <li key={index}>
            {POSE_LANDMARK_NAMES[index] || `Node ${index}`}: ({node.x.toFixed(2)}, {node.y.toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodeDisplay;
