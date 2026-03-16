// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';

// export type ChildDocument = HydratedDocument<Child>;

// @Schema({ timestamps: true })
// export class Child {
//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
//   parentId: mongoose.Types.ObjectId;

//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
//   teacherId: mongoose.Types.ObjectId;

//   @Prop()
//   firstName: string;

//   @Prop()
//   lastName: string;

//   @Prop()
//   age: string;

//   @Prop()
//   gender: string;

//   @Prop()
//   datoOfBirth: Date;

//   @Prop()
//   schoolName: string;

//   @Prop()
//   class: string;

//   @Prop()
//   profilePicture: string;

//   @Prop()
//   nickName: string;

//   @Prop()
//   primaryLanguage: string;

//   @Prop()
//   homeLanguage: string;

//   @Prop()
//   serviceStage: string;

//   @Prop()
//   startServiceDate: Date;

//   @Prop()
//   currentPlanType: string;

//   @Prop()
//   topPriority: string;

//   @Prop()
//   strength: string;

//   @Prop()
//   concerns: string;

//   @Prop()
//   preferredReinforcers: string[];

//   @Prop()
//   knownTrigger: string[];

//   @Prop()
//   communicationMode: string[];

//   @Prop()
//   safetyAlerts: string[];

//   @Prop()
//   emotionalLevel: string;

//   @Prop()
//   sensoryRegulationLevel: string;

//   @Prop()
//   socialLevel: string;

//   @Prop()
//   communicationLevel: string;

//   @Prop()
//   cognitiveLevel: string;

//   @Prop()
//   selfcareLevel: string;

//   @Prop()
//   grossMotorLevel: string;

//   @Prop()
//   fineMotorLevel: string;

//   @Prop({
//     _id: false,
//     type: {
//       value: { type: Number },
//       unit: { type: String },
//     },
//   })
//   height: {
//     value: number;
//     unit: string;
//   };

//   @Prop({
//     _id: false,
//     type: {
//       value: { type: Number },
//       unit: { type: String },
//     },
//   })
//   weight: {
//     value: number;
//     unit: string;
//   };

//   @Prop()
//   allergies: string;

//   @Prop()
//   dieteryRestrictions: string;

//   @Prop()
//   eatingNotes: string;

//   @Prop()
//   medications: string;

//   @Prop()
//   medicalNotes: string;

//   @Prop()
//   medicalHistory: string;

//   @Prop()
//   studentId: string;
// }

// export const ChildSchema = SchemaFactory.createForClass(Child);



import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChildDocument = HydratedDocument<Child>;

// ─── Reusable Sub-schemas ────────────────────────────────────────────────────

class Measurement {
  value: number;
  unit: string;
}

class ObservationEntry {
  observationContext: string;
  observationDate: Date;
  mainPersonalityTraits: string[];
  behaviorExample: string;
  interests: string;
  motivationEngagementTriggers: string;
  recorderName: string;
  attachments: string[]; // file URLs
}

// ─── Module 2: Learning Style ────────────────────────────────────────────────

class LevelNote {
  level: string; // 'A - Strong' | 'B - Moderate' | 'C - Passive' | 'N/A'
  note?: string;
}

class LearningStyleSection1 {
  participationGroupTeaching: LevelNote;
  participationSmallGroup: LevelNote;
  engagementSelfSelectedPlay: LevelNote;
  interestOutdoorMovement: LevelNote;
  initiativeDailyRoutines: LevelNote;
}

class LearningStyleSection2 {
  learnsThroughTouch: LevelNote;
  learnsThroughVisual: LevelNote;
  learnsThroughListening: LevelNote;
  learnsThroughBodyMovement: LevelNote;
}

class LearningStyleSection3 {
  interactionStylePeers: LevelNote;
  interactionStyleTeachers: LevelNote;
  participationGroupSituations: LevelNote;
  learnsThroughBodyMovementRhythm: LevelNote;
}

class LearningStyleSection4 {
  reactionToChallenges: LevelNote;
  taskCompletionPace: LevelNote;
  understandingInstructions: LevelNote;
  curiosityDuringExploration: LevelNote;
}

class Module2Summary {
  learningStyleSummary: string;
  primaryLearningPreference: string;
  secondaryLearningPreference: string;
  effectiveTeachingStrategies: string;
  attentionParticipationNotes: string;
  interactionNote: string;
  finalLearningStyleInterpretation: string;
}

// ─── Module 3: Comprehensive Ability Assessment ───────────────────────────────

class AbilityLevel {
  level: string; // 'Level 1 - Needs Support' | 'Level 2 - Emerging' | 'Level 3 - Age Appropriate'
  note?: string;
}

class HealthSelfCare {
  personalHygiene: AbilityLevel;
  selfFeedingSkills: AbilityLevel;
  dressingUndressing: AbilityLevel;
  grossMotorSkills: AbilityLevel;
  fineMotorSkills: AbilityLevel;
}

class LanguageAbility {
  expressiveLanguage: AbilityLevel;
  receptiveLanguage: AbilityLevel;
  storytellingNarrativeSkills: AbilityLevel;
  letterSoundRecognition: AbilityLevel;
  preReadingSkills: AbilityLevel;
}

class SocialAbility {
  interactivePlaySkills: AbilityLevel;
  emotionalRegulationCooping: AbilityLevel;
  followingGroupRules: AbilityLevel;
  conflictResolution: AbilityLevel;
  empathyPerspectiveTaking: AbilityLevel;
}

class ScienceDramaticPlay {
  scientificThinkingAndObservation: AbilityLevel;
  patternSequencing: AbilityLevel;
  understandingCauseEffect: AbilityLevel;
  buildingSpacialAwareness: AbilityLevel;
  socioEmotionalAndRolePlay: AbilityLevel;
}

class ArtsAbility {
  handEyeCoordination: AbilityLevel;
  numberRecognitionCounting: AbilityLevel;
  patternRecognition: AbilityLevel;
  musicalRhythm: AbilityLevel;
  visualArtsExpression: AbilityLevel;
  roleplayCreativeDance: AbilityLevel;
  useOfMiniatureObjects: AbilityLevel;
  dramatics: AbilityLevel;
}

class Module3Summary {
  strengthsNotableAbilities: string;
  areasNeedingSupport: string;
  domainSummary: string;
  recommendedFocusAreas: string[];
  finalAssessmentSummary: string;
}

// ─── Module 1: Personality & Interests ───────────────────────────────────────

class Module1Summary {
  strengthsNotableTraits: string;
  areasNeedingSupport: string;
  mainInterestsPreferences: string;
  motivationFactors: string;
  familyFeedbackSummary: string;
  finalPersonalityAssessment: string;
}

// ─── Main Child Schema ────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Child {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  parentId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  teacherId: mongoose.Types.ObjectId;

  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() age: string;
  @Prop() gender: string;
  @Prop() datoOfBirth: Date;
  @Prop() schoolName: string;
  @Prop() class: string;
  @Prop() profilePicture: string;
  @Prop() nickName: string;
  @Prop() primaryLanguage: string;
  @Prop() homeLanguage: string;
  @Prop() serviceStage: string;
  @Prop() startServiceDate: Date;
  @Prop() currentPlanType: string;
  @Prop() topPriority: string;
  @Prop() strength: string;
  @Prop() concerns: string;
  @Prop() preferredReinforcers: string[];
  @Prop() knownTrigger: string[];
  @Prop() communicationMode: string[];
  @Prop() safetyAlerts: string[];
  @Prop() emotionalLevel: string;
  @Prop() sensoryRegulationLevel: string;
  @Prop() socialLevel: string;
  @Prop() communicationLevel: string;
  @Prop() cognitiveLevel: string;
  @Prop() selfcareLevel: string;
  @Prop() grossMotorLevel: string;
  @Prop() fineMotorLevel: string;

  @Prop({ _id: false, type: { value: { type: Number }, unit: { type: String } } })
  height: Measurement;

  @Prop({ _id: false, type: { value: { type: Number }, unit: { type: String } } })
  weight: Measurement;

  @Prop() allergies: string;
  @Prop() dieteryRestrictions: string;
  @Prop() eatingNotes: string;
  @Prop() medications: string;
  @Prop() medicalNotes: string;
  @Prop() medicalHistory: string;
  @Prop() studentId: string;

  // ── Module 1: Personality & Interests ──────────────────────────────────────

  @Prop({ type: [Object], default: [] })
  module1Observations: ObservationEntry[];

  @Prop({ type: Object })
  module1Summary: Module1Summary;

  // ── Module 2: Learning Style ───────────────────────────────────────────────

  @Prop({ type: Object })
  module2Section1ParticipationAttention: LearningStyleSection1;

  @Prop({ type: Object })
  module2Section2SensoryLearning: LearningStyleSection2;

  @Prop({ type: Object })
  module2Section3InteractionSocial: LearningStyleSection3;

  @Prop({ type: Object })
  module2Section4TaskHandling: LearningStyleSection4;

  @Prop({ type: Object })
  module2Summary: Module2Summary;

  // ── Module 3: Comprehensive Ability Assessment ─────────────────────────────

  @Prop({ type: Object })
  module3HealthSelfCare: HealthSelfCare;

  @Prop({ type: Object })
  module3Language: LanguageAbility;

  @Prop({ type: Object })
  module3Social: SocialAbility;

  @Prop({ type: Object })
  module3ScienceDramaticPlay: ScienceDramaticPlay;

  @Prop({ type: Object })
  module3Arts: ArtsAbility;

  @Prop({ type: Object })
  module3Summary: Module3Summary;
}

export const ChildSchema = SchemaFactory.createForClass(Child);