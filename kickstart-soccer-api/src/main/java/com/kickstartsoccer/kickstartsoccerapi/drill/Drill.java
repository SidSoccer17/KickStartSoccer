package com.kickstartsoccer.kickstartsoccerapi.drill;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/**
 * A reusable soccer training activity with stable curriculum identity and coach-ready guidance.
 */
public record Drill(
        UUID id,
        @JsonProperty("title") @JsonAlias("name") @NotBlank String title,
        String diagramKey,
        @NotEmpty List<@NotBlank @Pattern(regexp = "(?i)U([5-9]|10)") String> ageGroups,
        @NotBlank String category,
        @Pattern(regexp = "(?i)(beginner|intermediate|advanced)") @NotBlank String difficulty,
        @Positive int durationMinutes,
        @NotEmpty List<@NotBlank String> instructions,
        @NotNull List<@NotBlank String> coachingTips,
        @NotNull List<@NotBlank String> equipment,
        String curriculumId,
        String primarySkill,
        List<String> secondarySkills,
        Integer minimumAge,
        Integer maximumAge,
        Integer minimumDurationMinutes,
        Integer maximumDurationMinutes,
        Integer minimumPlayers,
        String whatItTeaches,
        List<String> setupInstructions,
        List<String> easierVariations,
        List<String> harderVariations,
        List<String> safetyConsiderations,
        String contentSource) {

    @JsonProperty("name")
    public String name() {
        return title;
    }

    @JsonProperty("recommendedDurationMinutes")
    public int recommendedDurationMinutes() {
        return durationMinutes;
    }
}
