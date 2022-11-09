
# The Sidebar

The sidebar is located to the left of the [Pattern editor](pattern-editor.md)
and contains controls for the current song.

![sidebar](../img/interface/sidebar.png "The sidebar")

## Visualizer

The visualizer is an oscilloscope for the left and right channels. The top
scope is the left channel and the bottom is the right. You can change the colors
in the [Appearance](configuration/appearance.md) config.

## Song selector

Use this combo box to change the current song to edit/play. New songs can be
added from the [Module properties](module-properties.md) dialog.

## Song editor

This section has controls for changing the song's settings.

 - *Rows/beat* - This setting determines the number of rows that make up a beat.
   It is used for tempo calculation and for highlighting rows in the pattern
   editor. The default value for new songs is **4**.
 - *Rows/measure* - This setting determines how many rows make up a measure.
   This setting should be a multiple of the *Rows/beat* setting but this is not
   required. This setting is only used for highlighting rows in the pattern
   editor. The default value is **16**.
 - *Rows* - This is the number of rows each track contains. Click the button to
   change the setting. Note that setting a smaller size will truncate all
   tracks in the song and cannot be undone. The default setting is **64** rows.
 - *Speed* - Initial speed setting when playing the song. Note that the value
   is in hexadecimal. See [Speed](../tracker/speed.md) for more details. The
   default speed setting is **0x60**.

## Order editor

The order editor is where you edit the song's order. The song order is a list
of orders, which is a set of track IDs (one for each channel). You can reuse
existing tracks across orders. Each song can have a maximum of 256 orders, and
must have at least 1 order.

To edit the order, move the cursor via the mouse or keyboard and edit the track
ID via the keyboard.

Track IDs are in hexadecimal notation and can range from 0x00 to 0xFF.

### Toolbar

The order editor has a vertical toolbar to the left of the order grid. It
contains actions for editing the song's order. Some of these actions are the
same as the [Song](menus/song.md) menu's, also provided here for convenience.
The editor adds a few more actions not present in that menu.

#### Increment selected

Increments the track ID at the cursor position by 1. If Change all mode is
enabled, then all track IDs for the current row will be incremented by 1.

#### Decrement selected

Decrements the track ID at the cursor position by 1. If Change all mode is
enabled, then all track IDs for the current row will be decremented by 1.

#### Change all

Toggles Change all mode. If this mode is enabled, then all track IDs in the
order will be edited via the keyboard or increment/decrement actions.
