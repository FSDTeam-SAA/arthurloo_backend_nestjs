// import { Transform } from 'class-transformer';
// import {
//   IsArray,
//   IsMongoId,
//   IsObject,
//   IsOptional,
//   IsString,
// } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';

// const parseOptionalArray = ({ value }: { value: unknown }) => {
//   if (value === '' || value === null || value === undefined) {
//     return undefined;
//   }

//   if (Array.isArray(value)) {
//     return value;
//   }

//   if (typeof value === 'string') {
//     try {
//       const parsed = JSON.parse(value);
//       if (Array.isArray(parsed)) {
//         return parsed;
//       }
//     } catch {
//       return value
//         .split(',')
//         .map((item) => item.trim())
//         .filter(Boolean);
//     }
//   }

//   return value;
// };

// const parseOptionalObject = ({ value }: { value: unknown }) => {
//   if (value === '' || value === null || value === undefined) {
//     return undefined;
//   }

//   if (typeof value === 'string') {
//     try {
//       return JSON.parse(value);
//     } catch {
//       return value;
//     }
//   }

//   return value;
// };

// class MeasurementDto {
//   @ApiPropertyOptional({ example: 120 })
//   value?: number;

//   @ApiPropertyOptional({ example: 'cm' })
//   unit?: string;
// }

// export class CreateChildDto {
//   @ApiPropertyOptional({ example: '67c8db1f2b5d8c6d1f123456' })
//   @IsMongoId()
//   @IsOptional()
//   teacherId?: string;

//   @ApiPropertyOptional({ example: 'Liam' })
//   @IsString()
//   @IsOptional()
//   firstName?: string;

//   @ApiPropertyOptional({ example: 'Noah' })
//   @IsString()
//   @IsOptional()
//   lastName?: string;

//   @ApiPropertyOptional({ example: '7' })
//   @IsString()
//   @IsOptional()
//   age?: string;

//   @ApiPropertyOptional({ example: 'male' })
//   @IsString()
//   @IsOptional()
//   gender?: string;

//   @ApiPropertyOptional({ example: '2018-05-10T00:00:00.000Z' })
//   @IsString()
//   @IsOptional()
//   datoOfBirth?: string;

//   @ApiPropertyOptional({ example: 'Greenfield School' })
//   @IsString()
//   @IsOptional()
//   schoolName?: string;

//   @ApiPropertyOptional({ example: 'Grade 2' })
//   @IsString()
//   @IsOptional()
//   class?: string;

//   @ApiPropertyOptional({ type: 'string', format: 'binary' })
//   @IsOptional()
//   profilePicture?: string;

//   @ApiPropertyOptional({ example: 'Leo' })
//   @IsString()
//   @IsOptional()
//   nickName?: string;

//   @ApiPropertyOptional({ example: 'English' })
//   @IsString()
//   @IsOptional()
//   primaryLanguage?: string;

//   @ApiPropertyOptional({ example: 'Bangla' })
//   @IsString()
//   @IsOptional()
//   homeLanguage?: string;

//   @ApiPropertyOptional({ example: 'Assessment' })
//   @IsString()
//   @IsOptional()
//   serviceStage?: string;

//   @ApiPropertyOptional({ example: '2025-01-10T00:00:00.000Z' })
//   @IsString()
//   @IsOptional()
//   startServiceDate?: string;

//   @ApiPropertyOptional({ example: 'Premium' })
//   @IsString()
//   @IsOptional()
//   currentPlanType?: string;

//   @ApiPropertyOptional({ example: 'Speech support' })
//   @IsString()
//   @IsOptional()
//   topPriority?: string;

//   @ApiPropertyOptional({ example: 'Puzzle solving' })
//   @IsString()
//   @IsOptional()
//   strength?: string;

//   @ApiPropertyOptional({ example: 'Difficulty with transitions' })
//   @IsString()
//   @IsOptional()
//   concerns?: string;

//   @ApiPropertyOptional({ type: [String], example: ['Sticker', 'Music'] })
//   @Transform(parseOptionalArray)
//   @IsArray()
//   @IsOptional()
//   preferredReinforcers?: string[];

//   @ApiPropertyOptional({ type: [String], example: ['Loud noise', 'Crowded places'] })
//   @Transform(parseOptionalArray)
//   @IsArray()
//   @IsOptional()
//   knownTrigger?: string[];

//   @ApiPropertyOptional({ type: [String], example: ['Verbal', 'PECS'] })
//   @Transform(parseOptionalArray)
//   @IsArray()
//   @IsOptional()
//   communicationMode?: string[];

//   @ApiPropertyOptional({ type: [String], example: ['Elopement risk'] })
//   @Transform(parseOptionalArray)
//   @IsArray()
//   @IsOptional()
//   safetyAlerts?: string[];

//   @ApiPropertyOptional({ example: 'Moderate' })
//   @IsString()
//   @IsOptional()
//   emotionalLevel?: string;

//   @ApiPropertyOptional({ example: 'Needs support' })
//   @IsString()
//   @IsOptional()
//   sensoryRegulationLevel?: string;

//   @ApiPropertyOptional({ example: 'Emerging' })
//   @IsString()
//   @IsOptional()
//   socialLevel?: string;

//   @ApiPropertyOptional({ example: 'Functional' })
//   @IsString()
//   @IsOptional()
//   communicationLevel?: string;

//   @ApiPropertyOptional({ example: 'Age appropriate' })
//   @IsString()
//   @IsOptional()
//   cognitiveLevel?: string;

//   @ApiPropertyOptional({ example: 'Needs prompts' })
//   @IsString()
//   @IsOptional()
//   selfcareLevel?: string;

//   @ApiPropertyOptional({ example: 'Good balance' })
//   @IsString()
//   @IsOptional()
//   grossMotorLevel?: string;

//   @ApiPropertyOptional({ example: 'Improving grip' })
//   @IsString()
//   @IsOptional()
//   fineMotorLevel?: string;

//   @ApiPropertyOptional({
//     type: MeasurementDto,
//     example: { value: 120, unit: 'cm' },
//   })
//   @Transform(parseOptionalObject)
//   @IsObject()
//   @IsOptional()
//   height?: MeasurementDto;

//   @ApiPropertyOptional({
//     type: MeasurementDto,
//     example: { value: 22, unit: 'kg' },
//   })
//   @Transform(parseOptionalObject)
//   @IsObject()
//   @IsOptional()
//   weight?: MeasurementDto;

//   @ApiPropertyOptional({ example: 'Peanut' })
//   @IsString()
//   @IsOptional()
//   allergies?: string;

//   @ApiPropertyOptional({ example: 'No dairy' })
//   @IsString()
//   @IsOptional()
//   dieteryRestrictions?: string;

//   @ApiPropertyOptional({ example: 'Needs supervision during meals' })
//   @IsString()
//   @IsOptional()
//   eatingNotes?: string;

//   @ApiPropertyOptional({ example: 'Vitamin D' })
//   @IsString()
//   @IsOptional()
//   medications?: string;

//   @ApiPropertyOptional({ example: 'Carries inhaler' })
//   @IsString()
//   @IsOptional()
//   medicalNotes?: string;

//   @ApiPropertyOptional({ example: 'Asthma' })
//   @IsString()
//   @IsOptional()
//   medicalHistory?: string;

//   @ApiPropertyOptional({ example: 'STU-1001' })
//   @IsString()
//   @IsOptional()
//   studentId?: string;
// }

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// ─── Parsers ──────────────────────────────────────────────────────────────────

const parseOptionalArray = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);
    }
  }
  return value;
};

const parseOptionalObject = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

const parseOptionalString = ({ value }: { value: unknown }) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
};

// ─── Reusable DTOs ────────────────────────────────────────────────────────────

export class MeasurementDto {
  @ApiPropertyOptional({ example: 120 }) value?: number;
  @ApiPropertyOptional({ example: 'cm' }) unit?: string;
}

export class LevelNoteDto {
  @ApiPropertyOptional({
    example: 'A - Strong',
    description: 'A - Strong | B - Moderate | C - Passive | N/A',
  })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({ example: 'Child engages well in group settings' })
  @IsString()
  @IsOptional()
  note?: string;
}

export class AbilityLevelDto {
  @ApiPropertyOptional({
    example: 'Level 3 - Age Appropriate',
    description:
      'Level 1 - Needs Support | Level 2 - Emerging | Level 3 - Age Appropriate',
  })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({ example: 'Performs independently' })
  @IsString()
  @IsOptional()
  note?: string;
}

// ─── Module 1 DTOs ───────────────────────────────────────────────────────────

export class ObservationEntryDto {
  @ApiPropertyOptional({ example: 'Classroom' })
  @IsString()
  @IsOptional()
  observationContext?: string;

  @ApiPropertyOptional({ example: '2025-03-01T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  observationDate?: string;

  @ApiPropertyOptional({ type: [String], example: ['Calm', 'Active'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  mainPersonalityTraits?: string[];

  @ApiPropertyOptional({ example: 'Remained seated during story time' })
  @IsString()
  @IsOptional()
  behaviorExample?: string;

  @ApiPropertyOptional({ example: 'Art, Building' })
  @IsString()
  @IsOptional()
  interests?: string;

  @ApiPropertyOptional({ example: 'Peer recognition' })
  @IsString()
  @IsOptional()
  motivationEngagementTriggers?: string;

  @ApiPropertyOptional({ example: 'Ms. Johnson' })
  @IsString()
  @IsOptional()
  recorderName?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://cdn.example.com/photo.jpg'],
  })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class Module1SummaryDto {
  @ApiPropertyOptional({ example: 'Creative, empathetic, curious' })
  @IsString()
  @IsOptional()
  strengthsNotableTraits?: string;

  @ApiPropertyOptional({ example: 'Transitions between activities' })
  @IsString()
  @IsOptional()
  areasNeedingSupport?: string;

  @ApiPropertyOptional({ example: 'Puzzle solving, painting' })
  @IsString()
  @IsOptional()
  mainInterestsPreferences?: string;

  @ApiPropertyOptional({ example: 'Stickers and verbal praise' })
  @IsString()
  @IsOptional()
  motivationFactors?: string;

  @ApiPropertyOptional({ example: 'Parents noted strong interest in music' })
  @IsString()
  @IsOptional()
  familyFeedbackSummary?: string;

  @ApiPropertyOptional({
    example: 'Emerging social skills with strong artistic tendencies',
  })
  @IsString()
  @IsOptional()
  finalPersonalityAssessment?: string;
}

// ─── Module 2 DTOs ───────────────────────────────────────────────────────────

export class LearningStyleSection1Dto {
  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  participationGroupTeaching?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  participationSmallGroup?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  engagementSelfSelectedPlay?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  interestOutdoorMovement?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  initiativeDailyRoutines?: LevelNoteDto;
}

export class LearningStyleSection2Dto {
  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  learnsThroughTouch?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  learnsThroughVisual?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  learnsThroughListening?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  learnsThroughBodyMovement?: LevelNoteDto;
}

export class LearningStyleSection3Dto {
  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  interactionStylePeers?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  interactionStyleTeachers?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  participationGroupSituations?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  learnsThroughBodyMovementRhythm?: LevelNoteDto;
}

export class LearningStyleSection4Dto {
  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  reactionToChallenges?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  taskCompletionPace?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  understandingInstructions?: LevelNoteDto;

  @ApiPropertyOptional({ type: LevelNoteDto })
  @ValidateNested()
  @Type(() => LevelNoteDto)
  @IsOptional()
  curiosityDuringExploration?: LevelNoteDto;
}

export class Module2SummaryDto {
  @ApiPropertyOptional({ example: 'Child is a kinaesthetic learner' })
  @IsString()
  @IsOptional()
  learningStyleSummary?: string;

  @ApiPropertyOptional({ example: 'Kinaesthetic Learner' })
  @IsString()
  @IsOptional()
  primaryLearningPreference?: string;

  @ApiPropertyOptional({ example: 'Visual Learner' })
  @IsString()
  @IsOptional()
  secondaryLearningPreference?: string;

  @ApiPropertyOptional({
    example: 'Use hands-on activities and movement breaks',
  })
  @IsString()
  @IsOptional()
  effectiveTeachingStrategies?: string;

  @ApiPropertyOptional({ example: 'Requires redirection every 10 minutes' })
  @IsString()
  @IsOptional()
  attentionParticipationNotes?: string;

  @ApiPropertyOptional({ example: 'Prefers 1-on-1 interaction with teacher' })
  @IsString()
  @IsOptional()
  interactionNote?: string;

  @ApiPropertyOptional({ example: 'Strong bodily-kinaesthetic intelligence' })
  @IsString()
  @IsOptional()
  finalLearningStyleInterpretation?: string;
}

// ─── Module 3 DTOs ───────────────────────────────────────────────────────────

export class HealthSelfCareDto {
  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  personalHygiene?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  selfFeedingSkills?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  dressingUndressing?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  grossMotorSkills?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  fineMotorSkills?: AbilityLevelDto;
}

export class LanguageAbilityDto {
  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  expressiveLanguage?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  receptiveLanguage?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  storytellingNarrativeSkills?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  letterSoundRecognition?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  preReadingSkills?: AbilityLevelDto;
}

export class SocialAbilityDto {
  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  interactivePlaySkills?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  emotionalRegulationCooping?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  followingGroupRules?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  conflictResolution?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  empathyPerspectiveTaking?: AbilityLevelDto;
}

export class ScienceDramaticPlayDto {
  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  scientificThinkingAndObservation?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  patternSequencing?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  understandingCauseEffect?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  buildingSpacialAwareness?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  socioEmotionalAndRolePlay?: AbilityLevelDto;
}

export class ArtsAbilityDto {
  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  handEyeCoordination?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  numberRecognitionCounting?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  patternRecognition?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  musicalRhythm?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  visualArtsExpression?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  roleplayCreativeDance?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  useOfMiniatureObjects?: AbilityLevelDto;

  @ApiPropertyOptional({ type: AbilityLevelDto })
  @ValidateNested()
  @Type(() => AbilityLevelDto)
  @IsOptional()
  dramatics?: AbilityLevelDto;
}

export class Module3SummaryDto {
  @ApiPropertyOptional({ example: 'Strong gross motor and fine motor skills' })
  @IsString()
  @IsOptional()
  strengthsNotableAbilities?: string;

  @ApiPropertyOptional({
    example: 'Letter recognition needs continued support',
  })
  @IsString()
  @IsOptional()
  areasNeedingSupport?: string;

  @ApiPropertyOptional({ example: 'Performing at age level in most domains' })
  @IsString()
  @IsOptional()
  domainSummary?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Health/Self-Care', 'Language'],
  })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  recommendedFocusAreas?: string[];

  @ApiPropertyOptional({
    example: 'Overall strong profile with emerging literacy skills',
  })
  @IsString()
  @IsOptional()
  finalAssessmentSummary?: string;
}

// ─── Main CreateChildDto ──────────────────────────────────────────────────────

export class CreateChildDto {
  // Basic Info (unchanged)
  @ApiPropertyOptional({ example: '67c8db1f2b5d8c6d1f123456' })
  @Transform(parseOptionalString)
  @IsMongoId()
  @IsOptional()
  teacherId?: string;

  @ApiPropertyOptional({ example: 'Liam' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Noah' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '7' })
  @IsString()
  @IsOptional()
  age?: string;

  @ApiPropertyOptional({ example: 'male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: '2018-05-10T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  datoOfBirth?: string;

  @ApiPropertyOptional({ example: 'Greenfield School' })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiPropertyOptional({ example: 'Grade 2' })
  @IsString()
  @IsOptional()
  class?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description:
      'Upload one or more files to be stored in module1Observations[0].attachments',
  })
  @IsOptional()
  module1ObservationAttachments?: unknown[];

  @ApiPropertyOptional({ example: 'Leo' })
  @IsString()
  @IsOptional()
  nickName?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsString()
  @IsOptional()
  primaryLanguage?: string;

  @ApiPropertyOptional({ example: 'Bangla' })
  @IsString()
  @IsOptional()
  homeLanguage?: string;

  @ApiPropertyOptional({ example: 'Assessment' })
  @IsString()
  @IsOptional()
  serviceStage?: string;

  @ApiPropertyOptional({ example: '2025-01-10T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  startServiceDate?: string;

  @ApiPropertyOptional({ example: 'Premium' })
  @IsString()
  @IsOptional()
  currentPlanType?: string;

  @ApiPropertyOptional({ example: 'Speech support' })
  @IsString()
  @IsOptional()
  topPriority?: string;

  @ApiPropertyOptional({ example: 'Puzzle solving' })
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiPropertyOptional({ example: 'Difficulty with transitions' })
  @IsString()
  @IsOptional()
  concerns?: string;

  @ApiPropertyOptional({ type: [String], example: ['Sticker', 'Music'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  preferredReinforcers?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Loud noise', 'Crowded places'],
  })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  knownTrigger?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Verbal', 'PECS'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  communicationMode?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Elopement risk'] })
  @Transform(parseOptionalArray)
  @IsArray()
  @IsOptional()
  safetyAlerts?: string[];

  @ApiPropertyOptional({ example: 'Moderate' })
  @IsString()
  @IsOptional()
  emotionalLevel?: string;

  @ApiPropertyOptional({ example: 'Needs support' })
  @IsString()
  @IsOptional()
  sensoryRegulationLevel?: string;

  @ApiPropertyOptional({ example: 'Emerging' })
  @IsString()
  @IsOptional()
  socialLevel?: string;

  @ApiPropertyOptional({ example: 'Functional' })
  @IsString()
  @IsOptional()
  communicationLevel?: string;

  @ApiPropertyOptional({ example: 'Age appropriate' })
  @IsString()
  @IsOptional()
  cognitiveLevel?: string;

  @ApiPropertyOptional({ example: 'Needs prompts' })
  @IsString()
  @IsOptional()
  selfcareLevel?: string;

  @ApiPropertyOptional({ example: 'Good balance' })
  @IsString()
  @IsOptional()
  grossMotorLevel?: string;

  @ApiPropertyOptional({ example: 'Improving grip' })
  @IsString()
  @IsOptional()
  fineMotorLevel?: string;

  @ApiPropertyOptional({
    type: MeasurementDto,
    example: { value: 120, unit: 'cm' },
  })
  @Transform(parseOptionalObject)
  @IsObject()
  @IsOptional()
  height?: MeasurementDto;

  @ApiPropertyOptional({
    type: MeasurementDto,
    example: { value: 22, unit: 'kg' },
  })
  @Transform(parseOptionalObject)
  @IsObject()
  @IsOptional()
  weight?: MeasurementDto;

  @ApiPropertyOptional({ example: 'Peanut' })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({ example: 'No dairy' })
  @IsString()
  @IsOptional()
  dieteryRestrictions?: string;

  @ApiPropertyOptional({ example: 'Needs supervision during meals' })
  @IsString()
  @IsOptional()
  eatingNotes?: string;

  @ApiPropertyOptional({ example: 'Vitamin D' })
  @IsString()
  @IsOptional()
  medications?: string;

  @ApiPropertyOptional({ example: 'Carries inhaler' })
  @IsString()
  @IsOptional()
  medicalNotes?: string;

  @ApiPropertyOptional({ example: 'Asthma' })
  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @ApiPropertyOptional({ example: 'STU-1001' })
  @IsString()
  @IsOptional()
  studentId?: string;

  // ── Module 1: Personality & Interests ──────────────────────────────────────

  @ApiPropertyOptional({ type: [ObservationEntryDto] })
  @Transform(parseOptionalArray)
  @ValidateNested({ each: true })
  @Type(() => ObservationEntryDto)
  @IsArray()
  @IsOptional()
  module1Observations?: ObservationEntryDto[];

  @ApiPropertyOptional({ type: Module1SummaryDto })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => Module1SummaryDto)
  @IsOptional()
  module1Summary?: Module1SummaryDto;

  // ── Module 2: Learning Style ───────────────────────────────────────────────

  @ApiPropertyOptional({
    type: LearningStyleSection1Dto,
    description: 'Section 1 — Participation & Attention',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => LearningStyleSection1Dto)
  @IsOptional()
  module2Section1ParticipationAttention?: LearningStyleSection1Dto;

  @ApiPropertyOptional({
    type: LearningStyleSection2Dto,
    description: 'Section 2 — Sensory Learning Preference',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => LearningStyleSection2Dto)
  @IsOptional()
  module2Section2SensoryLearning?: LearningStyleSection2Dto;

  @ApiPropertyOptional({
    type: LearningStyleSection3Dto,
    description: 'Section 3 — Interaction & Social Preference',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => LearningStyleSection3Dto)
  @IsOptional()
  module2Section3InteractionSocial?: LearningStyleSection3Dto;

  @ApiPropertyOptional({
    type: LearningStyleSection4Dto,
    description: 'Section 4 — Task Handling & Problem Solving',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => LearningStyleSection4Dto)
  @IsOptional()
  module2Section4TaskHandling?: LearningStyleSection4Dto;

  @ApiPropertyOptional({ type: Module2SummaryDto })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => Module2SummaryDto)
  @IsOptional()
  module2Summary?: Module2SummaryDto;

  // ── Module 3: Comprehensive Ability Assessment ─────────────────────────────

  @ApiPropertyOptional({
    type: HealthSelfCareDto,
    description: 'Tab: Health / Self-Care',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => HealthSelfCareDto)
  @IsOptional()
  module3HealthSelfCare?: HealthSelfCareDto;

  @ApiPropertyOptional({
    type: LanguageAbilityDto,
    description: 'Tab: Language',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => LanguageAbilityDto)
  @IsOptional()
  module3Language?: LanguageAbilityDto;

  @ApiPropertyOptional({ type: SocialAbilityDto, description: 'Tab: Social' })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => SocialAbilityDto)
  @IsOptional()
  module3Social?: SocialAbilityDto;

  @ApiPropertyOptional({
    type: ScienceDramaticPlayDto,
    description: 'Tab: Science / Dramatic Play',
  })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => ScienceDramaticPlayDto)
  @IsOptional()
  module3ScienceDramaticPlay?: ScienceDramaticPlayDto;

  @ApiPropertyOptional({ type: ArtsAbilityDto, description: 'Tab: Arts' })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => ArtsAbilityDto)
  @IsOptional()
  module3Arts?: ArtsAbilityDto;

  @ApiPropertyOptional({ type: Module3SummaryDto })
  @Transform(parseOptionalObject)
  @ValidateNested()
  @Type(() => Module3SummaryDto)
  @IsOptional()
  module3Summary?: Module3SummaryDto;
}
