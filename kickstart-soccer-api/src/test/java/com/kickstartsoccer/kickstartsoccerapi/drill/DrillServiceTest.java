package com.kickstartsoccer.kickstartsoccerapi.drill;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class DrillServiceTest {

    private final DrillService drillService = new DrillService();

    @Test
    void seedsThirtySixCompleteDrillsAcrossSixCategories() {
        List<Drill> drills = drillService.findAll();
        assertEquals(36, drills.size());
        assertEquals(36, drills.stream().map(Drill::curriculumId).distinct().count());
        assertEquals(36, drills.stream().map(Drill::id).distinct().count());
        assertEquals(6, drillService.categories().size());
        drillService.categories().forEach(category -> assertEquals(6,
                drills.stream().filter(drill -> drill.category().equals(category)).count()));
        drills.forEach(drill -> {
            assertNotNull(drill.whatItTeaches(), drill.curriculumId());
            assertNotNull(drill.primarySkill(), drill.curriculumId());
            assertNotNull(drill.minimumAge(), drill.curriculumId());
            assertNotNull(drill.maximumAge(), drill.curriculumId());
            assertNotNull(drill.minimumDurationMinutes(), drill.curriculumId());
            assertNotNull(drill.maximumDurationMinutes(), drill.curriculumId());
            assertNotNull(drill.minimumPlayers(), drill.curriculumId());
            assertTrue(drill.minimumDurationMinutes() <= drill.durationMinutes());
            assertTrue(drill.maximumDurationMinutes() >= drill.durationMinutes());
            assertTrue(drill.setupInstructions().size() > 0);
            assertTrue(drill.instructions().size() >= 4);
            assertTrue(drill.coachingTips().size() >= 3);
            assertTrue(drill.easierVariations().size() > 0);
            assertTrue(drill.harderVariations().size() > 0);
            assertTrue(drill.safetyConsiderations().size() > 0);
            assertEquals("Original KickStart Soccer curriculum content", drill.contentSource());
        });
    }

    @Test
    void preservesOriginalPrimaryKeysWhileReconcilingOverlappingDrills() {
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000001"), drillService.findByCurriculumId("D01").id());
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000002"), drillService.findByCurriculumId("D02").id());
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000003"), drillService.findByCurriculumId("D25").id());
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000004"), drillService.findByCurriculumId("D10").id());
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000005"), drillService.findByCurriculumId("D20").id());
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000006"), drillService.findByCurriculumId("D33").id());
        assertEquals(1, drillService.findAll().stream().filter(drill -> drill.title().equals("Red Light, Green Light")).count());
    }

    @Test
    void filtersByAgeAndCategoryAndRejectsUnknownFilters() {
        assertTrue(drillService.findAll("U6", null).stream().allMatch(drill -> drill.ageGroups().contains("U6")));
        assertTrue(drillService.findAll(null, "Small-Sided Games").stream().allMatch(drill -> drill.category().equals("Small-Sided Games")));
        assertTrue(drillService.findAll("U8", "Passing and Awareness").stream()
                .allMatch(drill -> drill.ageGroups().contains("U8") && drill.category().equals("Passing and Awareness")));
        assertThrows(ResponseStatusException.class, () -> drillService.findAll("U9", null));
        assertThrows(ResponseStatusException.class, () -> drillService.findAll(null, "Unknown"));
    }

    @Test
    void repeatedSeedingDoesNotDuplicateDrillsOrRemoveCustomDrills() {
        Drill custom = new Drill(null, "My custom activity", null, List.of("U6"), "Custom", "beginner", 8,
                List.of("Players try an activity."), List.of("Have fun."), List.of("Ball"), null,
                "Dribbling", List.of(), 6, 6, 6, 10, 2, "A coach-created activity.", List.of("Mark a space."),
                List.of("Widen the area."), List.of("Add a passive defender."), List.of("Keep players separated."), "Coach-created");
        Drill created = drillService.create(custom);
        drillService.seedCurriculum();
        drillService.seedCurriculum();
        assertEquals(37, drillService.findAll().size());
        assertEquals("My custom activity", drillService.findById(created.id()).title());
        assertThrows(ResponseStatusException.class, () -> drillService.create(drillService.findByCurriculumId("D01")));
    }
}
