import { FoiaPeerShareInvitePage } from "../foia-peer-share-invite/shared";

// This prototype self-registers via import.meta.glob in apps/sandbox/src/App.tsx —
// meta.ts powers the gallery; this file is the lazy-loaded page. No edits to App.tsx.
export default function FoiaPeerShareInvite1Prototype() {
  return (
    <FoiaPeerShareInvitePage
      dateLabel="October 15, 2026"
      formName="foia-peer-share-1"
    />
  );
}
