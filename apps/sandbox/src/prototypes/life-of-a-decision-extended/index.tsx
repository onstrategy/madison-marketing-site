import { LifeOfADecisionDeck } from "../life-of-a-decision";

// The extended version of the GovAI talk visual. Same deck as
// ../life-of-a-decision, plus two clicks after "Every promise." that show the
// same record as staff and an elected official get it. Edit the scenes there;
// this page only switches the extended clicks on.
export default function LifeOfADecisionExtended() {
  return <LifeOfADecisionDeck extended />;
}
