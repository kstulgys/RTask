export enum Label {
  from = 'From',
  to = 'To',
}

export enum Side {
  left = 'Left',
  right = 'Right',
}

export type LeftOrRight = Side.left | Side.right;
export type FromOrTo = Label.from | Label.to;
