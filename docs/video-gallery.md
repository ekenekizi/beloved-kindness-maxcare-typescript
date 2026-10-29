# Video gallery

In Sanity Studio, open Gallery Videos and create a document. Upload an MP4 or WebM, add a thumbnail with an image description, a title and short description, then Publish. Other video formats need conversion first.

Optional: enter duration (03:42), upload WebVTT captions, and turn on Feature this video.
The upload/listing date orders videos newest first; it is not an activity-year filter.
If several videos are featured, the newest featured upload is used. If none are featured, the newest video is used. All other videos remain newest-first.

Videos appear under /gallery → Videos. No programme or year is needed.
Drafts are not shown. Published changes can take around 60 seconds to appear.
Unpublishing all videos shows the empty state. The Browse photos button switches back to Photos.
A loading failure has a separate retry message rather than claiming there are no uploads.

Only one clicked video is mounted in a native player inside a dialog. Closing it or switching tabs stops playback. Posters are displayed without loading video files for every card.
Sanity stores and serves these files as ordinary video assets; this does not implement streaming transcoding. Compress large uploads appropriately.

Manual checks:
- Empty Videos tab, Browse photos and arrow-key tab navigation.
- Publish one video: featured poster, title, native playback and close/Escape.
- Publish more videos: featured choice and newest-first cards.
- Captions, mobile playback, player errors, and changing tabs during playback.
- Photo programme/year filters and existing programme carousels continue working.
