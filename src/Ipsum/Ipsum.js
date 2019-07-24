import React from "react";
import cx from "classnames";
import styles from "./Ipsum.module.css";
const IpsumLinesLarge = [
  "Skysail scurvy snow scuppers tackle black spot clap of thunder scourge of the seven seas bring a spring upon her cable rigging. Grog blossom galleon parrel transom black jack scuppers hardtack Spanish Main dance the hempen jig spirits. Jolly Roger pillage Cat o'nine tails driver Chain Shot scallywag galleon Brethren of the Coast yard maroon.",
  "Clipper tackle fathom Plate Fleet bilged on her anchor spanker to go on account ballast Buccaneer shrouds. Carouser Corsair grog blossom transom prow mutiny reef cog pirate line. Loot hornswaggle no prey, no pay brigantine provost careen matey Jack Tar rutters holystone.",
  "Bilge water poop deck capstan lugsail Buccaneer topsail jury mast clipper sheet Privateer. Quarter nipperkin Pirate Round Pieces of Eight avast gunwalls salmagundi plunder belaying pin handsomely. Stern Davy Jones' Locker yo-ho-ho jury mast Buccaneer run a shot across the bow Arr wench deadlights barkadeer."
];
const IpsumLinesSmall = [
  "Skysail scurvy snow scuppers tackle black spot clap of thunder.",
];
export default function Ipsum({ count = 1, isSmall=true }) {
  const lines = isSmall ? IpsumLinesSmall : IpsumLinesLarge;
  return (
    <div className={cx(styles.root)}>
      {[...Array(count)].map((val, idxA) => {
        return (
          <div key={idxA} className={styles.section}>
            {lines.map((line, idxB) => {
              return <p key={idxB}>{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}
