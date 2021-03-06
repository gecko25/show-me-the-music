/* Styles */
import styles from "./icons.module.scss";

export const Loader = () => (
  <svg
    className={styles.Loader}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <rect x="17" y="22" width="16" height="56" fill="#000000">
      <animate
        attributeName="y"
        repeatCount="indefinite"
        dur="0.9900990099009901s"
        calcMode="spline"
        keyTimes="0;0.5;1"
        values="5.199999999999996;22;22"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        begin="-0.19801980198019803s"
      ></animate>
      <animate
        attributeName="height"
        repeatCount="indefinite"
        dur="0.9900990099009901s"
        calcMode="spline"
        keyTimes="0;0.5;1"
        values="89.60000000000001;56;56"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        begin="-0.19801980198019803s"
      ></animate>
    </rect>
    <rect x="42" y="22" width="16" height="56" fill="#000000">
      <animate
        attributeName="y"
        repeatCount="indefinite"
        dur="0.9900990099009901s"
        calcMode="spline"
        keyTimes="0;0.5;1"
        values="9.399999999999991;22;22"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        begin="-0.09900990099009901s"
      ></animate>
      <animate
        attributeName="height"
        repeatCount="indefinite"
        dur="0.9900990099009901s"
        calcMode="spline"
        keyTimes="0;0.5;1"
        values="81.20000000000002;56;56"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        begin="-0.09900990099009901s"
      ></animate>
    </rect>
    <rect x="67" y="22" width="16" height="56" fill="#000000">
      <animate
        attributeName="y"
        repeatCount="indefinite"
        dur="0.9900990099009901s"
        calcMode="spline"
        keyTimes="0;0.5;1"
        values="9.399999999999991;22;22"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
      ></animate>
      <animate
        attributeName="height"
        repeatCount="indefinite"
        dur="0.9900990099009901s"
        calcMode="spline"
        keyTimes="0;0.5;1"
        values="81.20000000000002;56;56"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
      ></animate>
    </rect>
  </svg>
);
export default Loader;
