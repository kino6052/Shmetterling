import { BehaviorSubject, Subject } from "rxjs";
import { InitSubject } from "./YouTubeService";
import { ShouldShowMenuSubject } from "./PlayerService";

export class Drawer {
  position = new BehaviorSubject(0);
  onOpen = new Subject();
  onClose = new Subject();
  isOpen = new BehaviorSubject(false);
  isClose = new BehaviorSubject(true);
  constructor(private start: number, private end: number, public time: number) {
    this.position.next(start);
    this.onOpen.subscribe(() => {
      this.isOpen.next(true);
      this.isClose.next(false);
    });
    this.onClose.subscribe(() => {
      this.isClose.next(true);
      this.isOpen.next(false);
    });
  }
  close() {
    const p = this.position.getValue();
    if (p !== this.end) return;
    this.position.next(this.start);
    setTimeout(() => {
      this.onClose.next();
    }, this.time * 1000);
  }
  open() {
    const p = this.position.getValue();
    if (p !== this.start) return;
    this.position.next(this.end);
    setTimeout(() => {
      this.onOpen.next();
    }, this.time * 1000);
  }
}

export const LeftDrawer = new Drawer(-70, 0, 0.5);
export const RightDrawer = new Drawer(120, 50, 0.5);

InitSubject.subscribe(() => {
  ShouldShowMenuSubject.subscribe((shouldShow) => {
    if (shouldShow) {
      LeftDrawer.open();
      RightDrawer.open();
    } else {
      LeftDrawer.close();
      RightDrawer.close();
    }
  });
});