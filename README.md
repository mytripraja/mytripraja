# my trip raja — Modular Launch Page

The page is intentionally split into separate components so each part can be changed independently.

## Files

### Background
- `css/background.css`
- `js/background.js`

Controls:
- star density
- star twinkle
- nebula position
- background movement

### Center line
- `css/beam.css`

Controls:
- horizontal beam
- moving color
- purple/blue glow
- left/right bright flares

### Circle
- `css/circle.css`

Controls:
- outer circle size
- ring spacing
- neon glow
- breathing animation

### Timer
- `css/timer.css`
- `js/timer.js`

Controls:
- timer font
- spacing
- countdown calculations

Launch moment is fixed to:
**11 February 2028, 4:15 PM IST (UTC+05:30).**

### Main layout
- `css/layout.css`
- `index.html`

Controls:
- heading
- branding
- social links
- email bar
- responsive one-screen layout

### Email database
- `php/save_email.php`
- `database/database.sql`

Import the SQL database and put the MySQL credentials into `php/save_email.php`.

## Social links

Facebook:
https://www.facebook.com/profile.php?id=61577792564324

Instagram:
https://www.instagram.com/mytripraja/

LinkedIn:
https://www.linkedin.com/company/mytripraja/

## Important

Open `index.html` locally to preview the visual design.

Email storage requires PHP + MySQL hosting. A local `file://` preview cannot execute `save_email.php`.
