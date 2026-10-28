# Aleena & Jaise — engagement invitation

The existing static invitation has been updated in place around the supplied visual flow: bride ring, groom ring, three scroll beats, then the event card and RSVP. It uses the supplied ring cutouts and a locally bundled floral background; no framework or external runtime is required.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` on desktop or a phone.

## Edit the event

Edit [content.js](content.js), the site's single event configuration. It contains the names, date and time, venue and map link, ring image paths, background music, share text, RSVP copy, WhatsApp number, and Open Graph settings.

The ring images are `assets/Aleena_Ring.png` and `assets/Jaise_Ring.png`. The floral background is `assets/floral-bokeh-background.webp`. The supplied music track is bundled at `assets/engagement-music.mp3`; music starts only after the visitor taps the floating control.

Set `RSVP_WHATSAPP_NUMBER` to the recipient's full international number using digits only. Leave it empty to open WhatsApp's recipient picker. Guests can choose an RSVP response before opening the prefilled message.

The ring scene follows three scroll beats: Aleena's ring falls, Jaise's ring falls, then both move together. With reduced motion enabled, the page shows the rings together in a static composition.

## Publish and sharing

Upload this folder to the site root of an HTTPS static host. Set `PUBLIC_URL` in [content.js](content.js) to the final URL with a trailing slash, then run `node prepare-publish.mjs` from this folder. That writes absolute page and image URLs into the initial HTML metadata for social previews. Invitation sharing includes the website URL; it never attaches the music file.

### Host on GitHub Pages

Create a GitHub repository and upload the ZIP contents directly into the repository root, keeping `index.html` at the root. In the repository, open **Settings → Pages** and select **Deploy from a branch**, then choose the `main` branch and `/ (root)`. GitHub Pages will publish the invitation pages and their local assets. For social sharing previews, set `PUBLIC_URL` in `content.js` to the published HTTPS URL and run `node prepare-publish.mjs` before committing the metadata update.

The map button opens the supplied Google Maps location.

## Invitation 2

Open [invitation2.html](invitation2.html) for the alternate floral design. It uses the supplied floral artwork as a static background, with softly falling blush petals around the edges. It keeps the event details, map, RSVP, sharing, and music controls, with no ring artwork or ring animation. Petals pause for visitors who prefer reduced motion. Use the “View Invitation 2” link at the bottom of the original page to switch to it.

Open [invitation3.html](invitation3.html) for a full-bleed version of the floral artwork. Its invitation text sits directly in the open center of the image, reveals in a writing-like sequence, and is surrounded by falling petals. It has no extra panel background or ring imagery.
