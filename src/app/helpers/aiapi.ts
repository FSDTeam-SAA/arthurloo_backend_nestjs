import axios from 'axios';

export const personality_and_interest = async (
  module1Observations: any[],
  module1Summary: any,
) => {
  const observation = module1Observations?.[0] ?? {};

  const response = await axios.post(
    'https://arthurloo.onrender.com/api/ai/v1/workflow/run/personality_and_interest',
    {
      personality_and_interest_data: {
        module1Observations,
        module1Summary,
        // observation fields flat করে পাঠাও
        observationContext: observation.observationContext,
        observationDate: observation.observationDate,
        mainPersonalityTraits: observation.mainPersonalityTraits,
        behaviorExample: observation.behaviorExample,
        interests: observation.interests,
        motivationEngagementTriggers: observation.motivationEngagementTriggers,
        recorderName: observation.recorderName,
        attachments: observation.attachments,
        // summary fields flat করে পাঠাও
        strengthsNotableTraits: module1Summary?.strengthsNotableTraits,
        areasNeedingSupport: module1Summary?.areasNeedingSupport,
        mainInterestsPreferences: module1Summary?.mainInterestsPreferences,
        motivationFactors: module1Summary?.motivationFactors,
        familyFeedbackSummary: module1Summary?.familyFeedbackSummary,
        finalPersonalityAssessment: module1Summary?.finalPersonalityAssessment,
      },
    },
  );

  if (!response.data?.run_id) {
    throw new Error('AI API did not return a run_id');
  }
  console.log('AI workflow triggered successfully, run_id:', response.data);

  return response.data.run_id as string; // "69d62109ee5fb6d185d70c3f"
};

export const learning_style_data = async (
  module2Section1ParticipationAttention: any,
  module2Section2SensoryLearning: any,
  module2Section3InteractionSocial: any,
  module2Section4TaskHandling: any,
  module2Summary: any,
) => {
  const response = await axios.post(
    'https://arthurloo.onrender.com/api/ai/v1/workflow/run/learning_style',
    {
      learning_style_data: {
        // Section 1 — Participation & Attention
        participationGroupTeaching:
          module2Section1ParticipationAttention?.participationGroupTeaching,
        participationSmallGroup:
          module2Section1ParticipationAttention?.participationSmallGroup,
        engagementSelfSelectedPlay:
          module2Section1ParticipationAttention?.engagementSelfSelectedPlay,
        interestOutdoorMovement:
          module2Section1ParticipationAttention?.interestOutdoorMovement,
        initiativeDailyRoutines:
          module2Section1ParticipationAttention?.initiativeDailyRoutines,

        // Section 2 — Sensory Learning
        learnsThroughTouch: module2Section2SensoryLearning?.learnsThroughTouch,
        learnsThroughVisual:
          module2Section2SensoryLearning?.learnsThroughVisual,
        learnsThroughListening:
          module2Section2SensoryLearning?.learnsThroughListening,
        learnsThroughBodyMovement:
          module2Section2SensoryLearning?.learnsThroughBodyMovement,

        // Section 3 — Interaction & Social
        interactionStylePeers:
          module2Section3InteractionSocial?.interactionStylePeers,
        interactionStyleTeachers:
          module2Section3InteractionSocial?.interactionStyleTeachers,
        participationGroupSituations:
          module2Section3InteractionSocial?.participationGroupSituations,
        learnsThroughBodyMovementRhythm:
          module2Section3InteractionSocial?.learnsThroughBodyMovementRhythm,

        // Section 4 — Task Handling
        reactionToChallenges: module2Section4TaskHandling?.reactionToChallenges,
        taskCompletionPace: module2Section4TaskHandling?.taskCompletionPace,
        understandingInstructions:
          module2Section4TaskHandling?.understandingInstructions,
        curiosityDuringExploration:
          module2Section4TaskHandling?.curiosityDuringExploration,

        // Summary
        learningStyleSummary: module2Summary?.learningStyleSummary,
        primaryLearningPreference: module2Summary?.primaryLearningPreference,
        secondaryLearningPreference:
          module2Summary?.secondaryLearningPreference,
        effectiveTeachingStrategies:
          module2Summary?.effectiveTeachingStrategies,
        attentionParticipationNotes:
          module2Summary?.attentionParticipationNotes,
        interactionNote: module2Summary?.interactionNote,
        finalLearningStyleInterpretation:
          module2Summary?.finalLearningStyleInterpretation,
      },
    },
  );

  if (!response.data?.run_id) {
    throw new Error('AI API did not return a run_id');
  }

  console.log(
    'Learning style workflow triggered successfully, run_id:',
    response.data,
  );

  return response.data.run_id as string;
};
