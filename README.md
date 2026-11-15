# TempoLab

Local-first running workout planner and experimental accuracy analyzer.

## Features
- Create structured workouts with Easy, Threshold, Interval, Recovery and Marathon segments.
- Import time-series CSV activity data.
- Reconstruct planned workout phases from elapsed time, without relying on imported kilometer splits.
- Compare actual versus target pace for each phase.
- Persist local workout state in the browser.

## Run
Open `index.html` in a modern browser. No build step required.

## Important limitations
- Intervals.icu synchronization and OAuth are **not implemented**.
- The accuracy formula is experimental and is **not** the proprietary VDOT O2 formula.
- Time-based reconstruction assumes elapsed workout time matches the plan; pauses, skipped phases, and manual transitions may require correction.
- Daniels book plans are not included until the user supplies the reference material.

Never commit API tokens or other credentials to this repository.
