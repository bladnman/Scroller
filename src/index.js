import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Ipsum from "./Ipsum/Ipsum";
import cx from "classnames";
import Scroller, {scrollTo} from "./Scroller";
import getPoint from "./utils/getPoint";

class App extends React.Component {
  state = {
    selectedIdx: 0,
    ipsumCount: 55,
    useSmallThoughts: false,
    fps: 60,
    easeFn: Scroller.EASE.linearTween,
    menuAreaHeight: "20em",
    isScrolling: false
  };
  bodyElem = undefined;
  bodyTopOffset = 0;
  _thoughtHeight = 0;

  /** LIFECYCLE */
  componentDidMount() {
    window.addEventListener("keydown", this.keyDownHandler);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  /** HANDLERS */
  keyDownHandler = ev => {
    const { ipsumCount } = this.state;
    const { thoughtHeight } = this;

    const isUp = ev.key === "ArrowUp";
    const isDown = ev.key === "ArrowDown";
    if (isUp || isDown) {
      ev.preventDefault();

      let selectedIdx = this.state.selectedIdx + (isUp ? -1 : 1);
      selectedIdx = Math.min(Math.max(selectedIdx, 0), ipsumCount - 1);

      this.setState({ selectedIdx });
      this.scrollToPoint(getPoint({ x: 0, y: selectedIdx * thoughtHeight }));
    }
  };
  handleScrollComplete = () => {
    this.scroller = null;
  };
  handleDurationChange = ev => {
    const { target } = ev;
    if (!target) return;
    this.setState({ durationMs: target.value });
  };

  /** SCROLL WORKERS */
  scrollToPoint(toPoint) {
    const { easeFn, durationMs, fps } = this;
    this.scroller && this.scroller.cancel();
    this.scroller = scrollTo({
      element: document.documentElement,
      toPoint,
      durationMs,
      easeFn,
      fps,
      onComplete: this.handleScrollComplete
    });
  }
  scrollToPointHOLD(toPoint) {
    const { easeFn, durationMs, fps } = this;
    this.scroller && this.scroller.cancel();
    this.scroller = new Scroller({
      element: document.documentElement,
      toPoint,
      durationMs,
      easeFn,
      fps,
      onComplete: this.handleScrollComplete
    });
  }

  /** INTERNALS */
  saveBodyElemRef = ref => {
    this.bodyElem = ref;
    this.bodyTopOffset = this.bodyElem.offsetTop;
  };
  saveEaseDropRef = ref => {
    this.easeDropElem = ref;
  };
  saveMenuAreaRef = ref => {
    this.menuAreaElem = ref;
    const rect = this.menuAreaElem.getBoundingClientRect();
    this.setState({ menuAreaHeight: rect.height });
  };
  saveDurationInputElem = ref => {
    this.durationInputElem = ref;
  };
  saveFPSInputElem = ref => {
    this.fpsInputElemt = ref;
  };
  get thoughtHeight() {
    // source a new height
    if (!this._thoughtHeight) {
      const selectedElem = document.querySelector(".isSelected");
      if (!selectedElem) return 0;
      const rect = selectedElem.getBoundingClientRect();
      this._thoughtHeight = rect.height;
    }

    return this._thoughtHeight;
  }
  get easeList() {
    if (!this._easeList) {
      this._easeList = Object.keys(Scroller.EASE);
    }
    return this._easeList;
  }
  get easeFn() {
    return Scroller.EASE[
      this.easeDropElem.options[this.easeDropElem.selectedIndex].value
    ];
  }
  get durationMs() {
    return this.durationInputElem.value || 0;
  }
  get fps() {
    return this.fpsInputElemt.value || 60;
  }
  get scroller() {
    return this._scroller;
  }
  set scroller(obj) {
    this._scroller = obj;
    if (!!this._scroller !== this.state.isScrolling) {
      this.setState({ isScrolling: !!this._scroller });
    }
  }

  /** RENDERERS */
  render() {
    const {
      selectedIdx,
      ipsumCount,
      useSmallThoughts,
      menuAreaHeight,
      isScrolling
    } = this.state;
    const {
      saveDurationInputElem,
      saveEaseDropRef,
      saveMenuAreaRef,
      easeList,
      saveBodyElemRef,
      saveFPSInputElem
    } = this;
    return (
      <div className="App">
        <div className="menuArea" ref={saveMenuAreaRef}>
          <h1>Let's do some navigating!</h1>
          <p>Use Up/Down arrows to move around here...</p>
          <div
            className={cx(["scrollingIndicator", isScrolling && "isScrolling"])}
          >
            {isScrolling ? "🦁" : "🐭"}
          </div>
          <div className="toolbar">
            <div className="tool">
              <div className="toolLabel">DurMs</div>
              <div className="toolInput">
              <input type="text" defaultValue="300" ref={saveDurationInputElem} style={{width:'4em'}} />
              </div>
            </div>
            <div className="tool">
              <div className="toolLabel">FPS</div>
              <div className="toolInput">
              <input type="text" defaultValue="60" ref={saveFPSInputElem} style={{width:'2em'}} />
              </div>
            </div>
            <div className="tool">
              <div className="toolLabel">Ease</div>
              <div className="toolInput">
              <select ref={saveEaseDropRef}>
              {easeList.map(item => (
                <option>{item}</option>
              ))}
            </select>
              </div>
            </div>
            

          </div>
        </div>

        <div
          className="appBody"
          ref={saveBodyElemRef}
          style={{ marginTop: menuAreaHeight + "px" }}
        >
          {[...Array(ipsumCount)].map((val, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={idx}
                className={cx("thoughtBlock", isSelected && "isSelected")}
              >
                <h3>Thought #{idx + 1}</h3>
                <Ipsum isSmall={useSmallThoughts} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
