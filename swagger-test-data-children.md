# Swagger Test Data — POST /children

Endpoint: `POST /children` (multipart/form-data, requires parent bearer token)

Swagger এ প্রতিটি field এর পাশে নিচের value গুলো paste করো। Object/Array fields গুলো JSON string হিসেবে paste করতে হবে।

---

## Basic Info (plain text fields)

| Field | Value |
|---|---|
| firstName | `Liam` |
| lastName | `Noah` |
| age | `7` |
| gender | `male` |
| datoOfBirth | `2018-05-10T00:00:00.000Z` |
| schoolName | `Greenfield School` |
| class | `Grade 2` |
| nickName | `Leo` |
| primaryLanguage | `English` |
| homeLanguage | `Bangla` |
| serviceStage | `Assessment` |
| startServiceDate | `2025-01-10T00:00:00.000Z` |
| currentPlanType | `Premium` |
| topPriority | `Speech support` |
| strength | `Puzzle solving` |
| concerns | `Difficulty with transitions` |
| emotionalLevel | `Moderate` |
| sensoryRegulationLevel | `Needs support` |
| socialLevel | `Emerging` |
| communicationLevel | `Functional` |
| cognitiveLevel | `Age appropriate` |
| selfcareLevel | `Needs prompts` |
| grossMotorLevel | `Good balance` |
| fineMotorLevel | `Improving grip` |
| allergies | `Peanut` |
| dieteryRestrictions | `No dairy` |
| eatingNotes | `Needs supervision during meals` |
| medications | `Vitamin D` |
| medicalNotes | `Carries inhaler` |
| medicalHistory | `Asthma` |

---

## Array fields (comma-separated OR JSON array)

| Field | Value |
|---|---|
| preferredReinforcers | `["Sticker","Music"]` |
| knownTrigger | `["Loud noise","Crowded places"]` |
| communicationMode | `["Verbal","PECS"]` |
| safetyAlerts | `["Elopement risk"]` |

---

## Measurement fields (JSON object)

**height**
```json
{"value":120,"unit":"cm"}
```

**weight**
```json
{"value":22,"unit":"kg"}
```

---

## Module 1 — Personality & Interests

**module1Observations** (array of objects)
```json
[
  {
    "observationContext": "Classroom",
    "observationDate": "2025-03-01T00:00:00.000Z",
    "mainPersonalityTraits": ["Calm", "Active"],
    "behaviorExample": "Remained seated during story time",
    "interests": "Art, Building",
    "motivationEngagementTriggers": "Peer recognition",
    "recorderName": "Ms. Johnson",
    "attachments": []
  }
]
```

**module1Summary**
```json
{
  "strengthsNotableTraits": "Creative, empathetic, curious",
  "areasNeedingSupport": "Transitions between activities",
  "mainInterestsPreferences": "Puzzle solving, painting",
  "motivationFactors": "Stickers and verbal praise",
  "familyFeedbackSummary": "Parents noted strong interest in music",
  "finalPersonalityAssessment": "Emerging social skills with strong artistic tendencies"
}
```

---

## Module 2 — Learning Style

**module2Section1ParticipationAttention**
```json
{
  "participationGroupTeaching": { "level": "A - Strong", "note": "Actively engages" },
  "participationSmallGroup": { "level": "B - Moderate", "note": "Needs prompts" },
  "engagementSelfSelectedPlay": { "level": "A - Strong", "note": "Very independent" },
  "interestOutdoorMovement": { "level": "A - Strong", "note": "Loves running" },
  "initiativeDailyRoutines": { "level": "B - Moderate", "note": "Follows with reminders" }
}
```

**module2Section2SensoryLearning**
```json
{
  "learnsThroughTouch": { "level": "A - Strong", "note": "Tactile explorer" },
  "learnsThroughVisual": { "level": "B - Moderate", "note": "Prefers pictures" },
  "learnsThroughListening": { "level": "C - Passive", "note": "Easily distracted" },
  "learnsThroughBodyMovement": { "level": "A - Strong", "note": "Kinaesthetic" }
}
```

**module2Section3InteractionSocial**
```json
{
  "interactionStylePeers": { "level": "B - Moderate", "note": "Parallel play" },
  "interactionStyleTeachers": { "level": "A - Strong", "note": "Seeks attention" },
  "participationGroupSituations": { "level": "B - Moderate", "note": "Warms up slowly" },
  "learnsThroughBodyMovementRhythm": { "level": "A - Strong", "note": "Follows rhythm" }
}
```

**module2Section4TaskHandling**
```json
{
  "reactionToChallenges": { "level": "B - Moderate", "note": "Gives up sometimes" },
  "taskCompletionPace": { "level": "B - Moderate", "note": "Steady" },
  "understandingInstructions": { "level": "A - Strong", "note": "One-step clear" },
  "curiosityDuringExploration": { "level": "A - Strong", "note": "Asks many questions" }
}
```

**module2Summary**
```json
{
  "learningStyleSummary": "Child is a kinaesthetic learner",
  "primaryLearningPreference": "Kinaesthetic Learner",
  "secondaryLearningPreference": "Visual Learner",
  "effectiveTeachingStrategies": "Use hands-on activities and movement breaks",
  "attentionParticipationNotes": "Requires redirection every 10 minutes",
  "interactionNote": "Prefers 1-on-1 interaction with teacher",
  "finalLearningStyleInterpretation": "Strong bodily-kinaesthetic intelligence"
}
```

---

## Module 3 — Comprehensive Ability Assessment

**module3HealthSelfCare**
```json
{
  "personalHygiene": { "level": "Level 2 - Emerging", "note": "Needs prompts" },
  "selfFeedingSkills": { "level": "Level 3 - Age Appropriate", "note": "Uses utensils" },
  "dressingUndressing": { "level": "Level 2 - Emerging", "note": "Buttons difficult" },
  "grossMotorSkills": { "level": "Level 3 - Age Appropriate", "note": "Runs and jumps" },
  "fineMotorSkills": { "level": "Level 2 - Emerging", "note": "Improving pencil grip" }
}
```

**module3Language**
```json
{
  "expressiveLanguage": { "level": "Level 3 - Age Appropriate", "note": "Clear sentences" },
  "receptiveLanguage": { "level": "Level 3 - Age Appropriate", "note": "Follows 2-step" },
  "storytellingNarrativeSkills": { "level": "Level 2 - Emerging", "note": "Brief retells" },
  "letterSoundRecognition": { "level": "Level 1 - Needs Support", "note": "Confuses sounds" },
  "preReadingSkills": { "level": "Level 2 - Emerging", "note": "Recognizes name" }
}
```

**module3Social**
```json
{
  "interactivePlaySkills": { "level": "Level 2 - Emerging", "note": "Parallel play" },
  "emotionalRegulationCooping": { "level": "Level 2 - Emerging", "note": "Needs coaching" },
  "followingGroupRules": { "level": "Level 2 - Emerging", "note": "Inconsistent" },
  "conflictResolution": { "level": "Level 1 - Needs Support", "note": "Needs adult help" },
  "empathyPerspectiveTaking": { "level": "Level 2 - Emerging", "note": "Growing awareness" }
}
```

**module3ScienceDramaticPlay**
```json
{
  "scientificThinkingAndObservation": { "level": "Level 3 - Age Appropriate", "note": "Curious observer" },
  "patternSequencing": { "level": "Level 2 - Emerging", "note": "Simple patterns" },
  "understandingCauseEffect": { "level": "Level 3 - Age Appropriate", "note": "Predicts outcomes" },
  "buildingSpacialAwareness": { "level": "Level 3 - Age Appropriate", "note": "Good with blocks" },
  "socioEmotionalAndRolePlay": { "level": "Level 2 - Emerging", "note": "Short scenarios" }
}
```

**module3Arts**
```json
{
  "handEyeCoordination": { "level": "Level 3 - Age Appropriate", "note": "Accurate" },
  "numberRecognitionCounting": { "level": "Level 2 - Emerging", "note": "Counts to 20" },
  "patternRecognition": { "level": "Level 2 - Emerging", "note": "Basic patterns" },
  "musicalRhythm": { "level": "Level 3 - Age Appropriate", "note": "Claps beats" },
  "visualArtsExpression": { "level": "Level 3 - Age Appropriate", "note": "Creative drawings" },
  "roleplayCreativeDance": { "level": "Level 2 - Emerging", "note": "Enjoys dress-up" },
  "useOfMiniatureObjects": { "level": "Level 3 - Age Appropriate", "note": "Detailed play" },
  "dramatics": { "level": "Level 2 - Emerging", "note": "Short performances" }
}
```

**module3Summary**
```json
{
  "strengthsNotableAbilities": "Strong gross motor and fine motor skills",
  "areasNeedingSupport": "Letter recognition needs continued support",
  "domainSummary": "Performing at age level in most domains",
  "recommendedFocusAreas": ["Health/Self-Care", "Language"],
  "finalAssessmentSummary": "Overall strong profile with emerging literacy skills"
}
```

---

## File fields

- **profilePicture** — any image file (jpg/png)
- **module1ObservationAttachments** — 1 থেকে 10 টা file (photos/docs)

---

## Minimal test (শুধু basic info দিয়ে test করতে চাইলে)

```
firstName: Liam
lastName: Noah
age: 7
gender: male
schoolName: Greenfield School
class: Grade 2
```

এটুকু দিলেই child create হয়ে যাবে, AI trigger হবে না (module data না থাকায়)।
