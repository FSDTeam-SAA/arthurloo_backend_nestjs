import axios from 'axios';

interface RunAllModulePayload {
  // Module 1 — Personality & Interests
  module1Observations?: any[];
  module1Summary?: any;

  // Module 2 — Learning Style
  module2Section1ParticipationAttention?: any;
  module2Section2SensoryLearning?: any;
  module2Section3InteractionSocial?: any;
  module2Section4TaskHandling?: any;
  module2Summary?: any;

  // Module 3 — Personal Ability
  module3HealthSelfCare?: any;
  module3Language?: any;
  module3Social?: any;
  module3ScienceDramaticPlay?: any;
  module3Arts?: any;
  module3Summary?: any;
}

export const run_all_module = async (data: RunAllModulePayload) => {
  const observation = data.module1Observations?.[0] ?? {};

  const payload = {
    personality_and_interest_data: {
      module1Observations: data.module1Observations,
      module1Summary: data.module1Summary,
      observationContext: observation.observationContext,
      observationDate: observation.observationDate,
      mainPersonalityTraits: observation.mainPersonalityTraits,
      behaviorExample: observation.behaviorExample,
      interests: observation.interests,
      motivationEngagementTriggers: observation.motivationEngagementTriggers,
      recorderName: observation.recorderName,
      attachments: observation.attachments,
      strengthsNotableTraits: data.module1Summary?.strengthsNotableTraits,
      areasNeedingSupport: data.module1Summary?.areasNeedingSupport,
      mainInterestsPreferences: data.module1Summary?.mainInterestsPreferences,
      motivationFactors: data.module1Summary?.motivationFactors,
      familyFeedbackSummary: data.module1Summary?.familyFeedbackSummary,
      finalPersonalityAssessment:
        data.module1Summary?.finalPersonalityAssessment,
    },
    learning_style_data: {
      // Section 1 — Participation & Attention
      participationGroupTeaching:
        data.module2Section1ParticipationAttention?.participationGroupTeaching,
      participationSmallGroup:
        data.module2Section1ParticipationAttention?.participationSmallGroup,
      engagementSelfSelectedPlay:
        data.module2Section1ParticipationAttention?.engagementSelfSelectedPlay,
      interestOutdoorMovement:
        data.module2Section1ParticipationAttention?.interestOutdoorMovement,
      initiativeDailyRoutines:
        data.module2Section1ParticipationAttention?.initiativeDailyRoutines,

      // Section 2 — Sensory Learning
      learnsThroughTouch:
        data.module2Section2SensoryLearning?.learnsThroughTouch,
      learnsThroughVisual:
        data.module2Section2SensoryLearning?.learnsThroughVisual,
      learnsThroughListening:
        data.module2Section2SensoryLearning?.learnsThroughListening,
      learnsThroughBodyMovement:
        data.module2Section2SensoryLearning?.learnsThroughBodyMovement,

      // Section 3 — Interaction & Social
      interactionStylePeers:
        data.module2Section3InteractionSocial?.interactionStylePeers,
      interactionStyleTeachers:
        data.module2Section3InteractionSocial?.interactionStyleTeachers,
      participationGroupSituations:
        data.module2Section3InteractionSocial?.participationGroupSituations,
      learnsThroughBodyMovementRhythm:
        data.module2Section3InteractionSocial?.learnsThroughBodyMovementRhythm,

      // Section 4 — Task Handling
      reactionToChallenges:
        data.module2Section4TaskHandling?.reactionToChallenges,
      taskCompletionPace: data.module2Section4TaskHandling?.taskCompletionPace,
      understandingInstructions:
        data.module2Section4TaskHandling?.understandingInstructions,
      curiosityDuringExploration:
        data.module2Section4TaskHandling?.curiosityDuringExploration,

      // Summary
      learningStyleSummary: data.module2Summary?.learningStyleSummary,
      primaryLearningPreference: data.module2Summary?.primaryLearningPreference,
      secondaryLearningPreference:
        data.module2Summary?.secondaryLearningPreference,
      effectiveTeachingStrategies:
        data.module2Summary?.effectiveTeachingStrategies,
      attentionParticipationNotes:
        data.module2Summary?.attentionParticipationNotes,
      interactionNote: data.module2Summary?.interactionNote,
      finalLearningStyleInterpretation:
        data.module2Summary?.finalLearningStyleInterpretation,
    },
    personal_ability_data: {
      // Health & Self Care
      personalHygiene: data.module3HealthSelfCare?.personalHygiene,
      selfFeedingSkills: data.module3HealthSelfCare?.selfFeedingSkills,
      dressingUndressing: data.module3HealthSelfCare?.dressingUndressing,
      grossMotorSkills: data.module3HealthSelfCare?.grossMotorSkills,
      fineMotorSkills: data.module3HealthSelfCare?.fineMotorSkills,

      // Language
      expressiveLanguage: data.module3Language?.expressiveLanguage,
      receptiveLanguage: data.module3Language?.receptiveLanguage,
      storytellingNarrativeSkills:
        data.module3Language?.storytellingNarrativeSkills,
      letterSoundRecognition: data.module3Language?.letterSoundRecognition,
      preReadingSkills: data.module3Language?.preReadingSkills,

      // Social
      interactivePlaySkills: data.module3Social?.interactivePlaySkills,
      emotionalRegulationCooping:
        data.module3Social?.emotionalRegulationCooping,
      followingGroupRules: data.module3Social?.followingGroupRules,
      conflictResolution: data.module3Social?.conflictResolution,
      empathyPerspectiveTaking: data.module3Social?.empathyPerspectiveTaking,

      // Science & Dramatic Play
      scientificThinkingAndObservation:
        data.module3ScienceDramaticPlay?.scientificThinkingAndObservation,
      patternSequencing: data.module3ScienceDramaticPlay?.patternSequencing,
      understandingCauseEffect:
        data.module3ScienceDramaticPlay?.understandingCauseEffect,
      buildingSpacialAwareness:
        data.module3ScienceDramaticPlay?.buildingSpacialAwareness,
      socioEmotionalAndRolePlay:
        data.module3ScienceDramaticPlay?.socioEmotionalAndRolePlay,

      // Arts
      handEyeCoordination: data.module3Arts?.handEyeCoordination,
      numberRecognitionCounting: data.module3Arts?.numberRecognitionCounting,
      patternRecognition: data.module3Arts?.patternRecognition,
      musicalRhythm: data.module3Arts?.musicalRhythm,
      visualArtsExpression: data.module3Arts?.visualArtsExpression,
      roleplayCreativeDance: data.module3Arts?.roleplayCreativeDance,
      useOfMiniatureObjects: data.module3Arts?.useOfMiniatureObjects,
      dramatics: data.module3Arts?.dramatics,

      // Module 3 Summary
      strengthsNotableAbilities: data.module3Summary?.strengthsNotableAbilities,
      areasNeedingSupport: data.module3Summary?.areasNeedingSupport,
      domainSummary: data.module3Summary?.domainSummary,
      recommendedFocusAreas: data.module3Summary?.recommendedFocusAreas,
      finalAssessmentSummary: data.module3Summary?.finalAssessmentSummary,
    },
  };

  const response = await axios.post(
    'https://arthurloo.onrender.com/api/ai/v1/workflow/run/all-module/',
    payload,
  );

  // ── Extract run IDs from response ─────────────────────────────────────────
  // API returns: { status: true, status_code: 200, run_id: [pi_id, ls_id, pa_id] }
  const raw = response.data;
  const runIds: string[] = Array.isArray(raw?.run_id) ? raw.run_id : [];

  if (runIds.length < 3) {
    console.error('AI API did not return 3 run IDs. Raw response:', JSON.stringify(raw, null, 2));
    throw new Error('AI API did not return the expected IDs');
  }

  const [personalityAndInterestId, learningStyleId, abilityAssessmentId] = runIds;

  console.log('All-module AI workflow triggered successfully, ids:', {
    personalityAndInterestId,
    learningStyleId,
    abilityAssessmentId,
  });

  return [personalityAndInterestId, learningStyleId, abilityAssessmentId] as [
    string,
    string,
    string,
  ];
};
