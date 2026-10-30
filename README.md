# Aleena & Jaise — engagement invitation

The root `index.html` is Invitation 3: a full-bleed floral invitation with falling petals and a top-to-bottom writing reveal. The original ring-story design is preserved as `invitation1.html`; `invitation2.html` is the alternate floral layout; `invitation4.html` is the new brown-and-beige minimalist invitation.

## Pages

- `index.html` — Invitation 3, the default homepage
- `invitation1.html` — original ring animation invitation
- `invitation2.html` — floral panel with petal animation
- `invitation3.html` — same design as the default homepage, with its own shareable URL
- `invitation4.html` — new minimalist beige invitation with a warm brown palette

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` on desktop or a phone.

## Edit event details

Edit [content.js](content.js), the site's single event configuration. It contains the names, date and time, venue and map link, ring image paths, background music, share text, RSVP copy, WhatsApp number, and Open Graph settings.

The original ring design uses `assets/Aleena_Ring.png` and `assets/Jaise_Ring.png`. Music starts only after the visitor taps the floating control; the current soundtrack is extracted from the supplied wedding-theme video as `assets/wedding-theme-music.m4a`. Set `RSVP_WHATSAPP_NUMBER` to a full international number using digits only, or leave it empty to open WhatsApp's recipient picker.

## Host on GitHub Pages

Extract the ZIP and upload its contents—including the `assets` folder—into the repository root. Do not upload the enclosing extracted folder. Confirm `index.html` is directly in the repository root, then select **Settings → Pages → Deploy from a branch**, choose the source branch and `/ (root)`, and save. The root URL opens Invitation 3; `invitation1.html` through `invitation4.html` are also available as separate pages.

For social sharing previews, set `PUBLIC_URL` in [content.js](content.js) to the published HTTPS URL with a trailing slash, then run `node prepare-publish.mjs` and commit the updated `index.html`.
