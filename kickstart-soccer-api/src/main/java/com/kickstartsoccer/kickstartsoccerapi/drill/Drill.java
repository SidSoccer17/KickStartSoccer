package com.kickstartsoccer.kickstartsoccerapi.drill;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/** A reusable soccer training drill in the drill library. */
public record Drill(
        /** Identifier assigned by the service; clients may omit it when creating a drill. */
        UUID id,
        /** Short, display-friendly name for the drill. */
        @NotBlank String title,
        /** Target age groups. Each value must be U6, U7, U8, U9, or U10. */
        @NotEmpty List<@NotBlank @Pattern(regexp = "(?i)U([6-9]|10)") String> ageGroups,
        /** Primary skill area: passing, dribbling, or defending. */
        @Pattern(regexp = "(?i)(passing|dribbling|defending)")
        @NotBlank String category,
        /** Difficulty level: beginner, intermediate, or advanced. */
        @Pattern(regexp = "(?i)(beginner|intermediate|advanced)")
        @NotBlank String difficulty,
        /** Estimated total time to complete the drill, in minutes. */
        @Positive int durationMinutes,
        /** Ordered steps for setting up and running the drill. */
        @NotEmpty List<@NotBlank String> instructions,
        /** Coaching cues; use an empty list when there are none. */
        @NotNull List<@NotBlank String> coachingTips,
        /** Required equipment; use an empty list when none is needed. */
        @NotNull List<@NotBlank String> equipment) {
}
