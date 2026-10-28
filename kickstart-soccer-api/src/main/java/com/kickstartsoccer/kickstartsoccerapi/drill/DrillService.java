package com.kickstartsoccer.kickstartsoccerapi.drill;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.Predicate;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DrillService {

    private final ConcurrentMap<UUID, Drill> drills = new ConcurrentHashMap<>();
    private final List<Drill> curriculum = DrillCatalog.all();

    public DrillService() {
        seedCurriculum();
    }

    public List<Drill> findAll() {
        return findAll(null, null);
    }

    public List<Drill> findAll(String age, String category) {
        Predicate<Drill> matches = drill -> true;
        if (age != null && !age.isBlank()) {
            String requestedAge = normalizeAge(age);
            matches = matches.and(drill -> drill.ageGroups().stream()
                    .anyMatch(drillAge -> drillAge.equalsIgnoreCase(requestedAge)));
        }
        if (category != null && !category.isBlank()) {
            String requestedCategory = normalizeCategory(category);
            matches = matches.and(drill -> drill.category().equalsIgnoreCase(requestedCategory));
        }
        return drills.values().stream()
                .filter(matches)
                .sorted(Comparator.comparing(Drill::curriculumId, Comparator.nullsLast(String::compareTo)))
                .toList();
    }

    public List<String> categories() {
        return curriculum.stream().map(Drill::category).distinct().sorted().toList();
    }

    public Drill findById(UUID id) {
        Drill drill = drills.get(id);
        if (drill == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drill not found");
        }
        return drill;
    }

    public Drill findByCurriculumId(String curriculumId) {
        return drills.values().stream()
                .filter(drill -> curriculumId.equalsIgnoreCase(drill.curriculumId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Drill not found"));
    }

    public Drill create(Drill drill) {
        if (drill.curriculumId() != null && drills.values().stream()
                .anyMatch(existing -> drill.curriculumId().equalsIgnoreCase(existing.curriculumId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Curriculum drill already exists");
        }
        Drill created = withId(drill, UUID.randomUUID());
        drills.put(created.id(), created);
        return created;
    }

    public Drill update(UUID id, Drill drill) {
        Drill updated = withId(drill, id);
        return drills.compute(id, (key, existing) -> {
            if (existing == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drill not found");
            }
            return updated;
        });
    }

    public void delete(UUID id) {
        if (drills.remove(id) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drill not found");
        }
    }

    void seedCurriculum() {
        curriculum.forEach(drill -> drills.putIfAbsent(drill.id(), drill));
    }

    private String normalizeAge(String age) {
        String normalized = age.trim().toUpperCase();
        if (!List.of("U5", "U6", "U7", "U8").contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Age filter must be U5, U6, U7, or U8");
        }
        return normalized;
    }

    private String normalizeCategory(String category) {
        String normalized = category.trim();
        if (curriculum.stream().noneMatch(drill -> drill.category().equalsIgnoreCase(normalized))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown drill category");
        }
        return normalized;
    }

    private Drill withId(Drill drill, UUID id) {
        return new Drill(
                id,
                drill.title(),
                drill.diagramKey(),
                drill.ageGroups(),
                drill.category(),
                drill.difficulty(),
                drill.durationMinutes(),
                drill.instructions(),
                drill.coachingTips(),
                drill.equipment(),
                drill.curriculumId(),
                drill.primarySkill(),
                drill.secondarySkills(),
                drill.minimumAge(),
                drill.maximumAge(),
                drill.minimumDurationMinutes(),
                drill.maximumDurationMinutes(),
                drill.minimumPlayers(),
                drill.whatItTeaches(),
                drill.setupInstructions(),
                drill.easierVariations(),
                drill.harderVariations(),
                drill.safetyConsiderations(),
                drill.contentSource());
    }
}
