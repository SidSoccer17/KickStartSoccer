package com.kickstartsoccer.kickstartsoccerapi.drill;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DrillService {

    private final ConcurrentMap<UUID, Drill> drills = new ConcurrentHashMap<>();

    public DrillService() {
        createInitialDrills().forEach(drill -> drills.put(drill.id(), drill));
    }

    public List<Drill> findAll() {
        return drills.values().stream()
                .sorted(Comparator.comparing(Drill::title, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    public Drill findById(UUID id) {
        Drill drill = drills.get(id);
        if (drill == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Drill not found");
        }
        return drill;
    }

    public Drill create(Drill drill) {
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

    private Drill withId(Drill drill, UUID id) {
        return new Drill(
                id,
                drill.title(),
                drill.ageGroups(),
                drill.category(),
                drill.difficulty(),
                drill.durationMinutes(),
                drill.instructions(),
                drill.coachingTips(),
                drill.equipment());
    }

    private List<Drill> createInitialDrills() {
        return List.of(
                new Drill(
                        UUID.fromString("00000000-0000-0000-0000-000000000001"),
                        "Red Light, Green Light",
                        List.of("U6", "U7"),
                        "Dribbling",
                        "Beginner",
                        5,
                        List.of(
                                "Mark a playing area with cones.",
                                "Give each player a ball.",
                                "Call green light for players to dribble.",
                                "Call red light for players to stop their ball."),
                        List.of(
                                "Encourage small touches.",
                                "Remind players to look for open space."),
                        List.of("Soccer ball for each player", "Cones")),
                new Drill(
                        UUID.fromString("00000000-0000-0000-0000-000000000002"),
                        "Animal Dribbling",
                        List.of("U6", "U7"),
                        "Dribbling",
                        "Beginner",
                        5,
                        List.of(
                                "Mark a playing area.",
                                "Ask players to dribble within the area.",
                                "Call out an animal and demonstrate a movement.",
                                "Change the prompt after a short round."),
                        List.of(
                                "Keep the prompts simple.",
                                "Celebrate creative movement."),
                        List.of("Soccer ball for each player", "Cones")),
                new Drill(
                        UUID.fromString("00000000-0000-0000-0000-000000000003"),
                        "Gate Passing",
                        List.of("U6", "U7"),
                        "Passing",
                        "Beginner",
                        6,
                        List.of(
                                "Create several gates with pairs of cones.",
                                "Put players in pairs with one ball.",
                                "Ask pairs to pass through a gate.",
                                "Move to another gate after a successful pass."),
                        List.of(
                                "Demonstrate a gentle inside-foot pass.",
                                "Allow players time to stop the ball."),
                        List.of("Soccer balls", "Cones")),
                new Drill(
                        UUID.fromString("00000000-0000-0000-0000-000000000004"),
                        "Treasure Dribble",
                        List.of("U6", "U7"),
                        "Dribbling",
                        "Beginner",
                        6,
                        List.of(
                                "Mark a home area and a treasure area.",
                                "Give each player a ball.",
                                "Ask players to dribble to the treasure area.",
                                "Have players turn and dribble home."),
                        List.of(
                                "Leave room between players.",
                                "Encourage control rather than racing."),
                        List.of("Soccer ball for each player", "Cones")),
                new Drill(
                        UUID.fromString("00000000-0000-0000-0000-000000000005"),
                        "Shoot at the Castle",
                        List.of("U6", "U7"),
                        "Passing",
                        "Beginner",
                        6,
                        List.of(
                                "Set up separate cone targets.",
                                "Place a ball a short distance from each target.",
                                "Ask players to aim at their target.",
                                "Retrieve balls when the coach gives the signal."),
                        List.of(
                                "Keep shooting lanes separated.",
                                "Focus on aiming rather than power."),
                        List.of("Soccer balls", "Cones")),
                new Drill(
                        UUID.fromString("00000000-0000-0000-0000-000000000006"),
                        "Small-Sided Game",
                        List.of("U6", "U7"),
                        "Defending",
                        "Beginner",
                        10,
                        List.of(
                                "Mark a small field with cone goals.",
                                "Divide players into small teams.",
                                "Explain the field boundaries and goals.",
                                "Play short rounds with breaks."),
                        List.of(
                                "Encourage participation.",
                                "Keep explanations brief."),
                        List.of("Soccer ball", "Cones", "Training bibs")));
    }
}
