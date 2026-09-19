import { FoiaPeerShareInvitePage } from "../foia-peer-share-invite/shared";

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function FoiaPeerShareInvite2Prototype() {
  return (
    <FoiaPeerShareInvitePage
      dateLabel="November 19, 2026"
      formName="foia-peer-share-2"
    />
  );
}
