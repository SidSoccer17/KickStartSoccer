package com.kickstartsoccer.kickstartsoccerapi.drill;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/drills")
public class DrillController {

    private final DrillService drillService;

    public DrillController(DrillService drillService) {
        this.drillService = drillService;
    }

    @GetMapping
    public List<Drill> findAll(
            @RequestParam(required = false) String age,
            @RequestParam(required = false) String category) {
        return drillService.findAll(age, category);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return drillService.categories();
    }

    @GetMapping("/curriculum/{curriculumId}")
    public Drill findByCurriculumId(@PathVariable String curriculumId) {
        return drillService.findByCurriculumId(curriculumId);
    }

    @GetMapping("/{id}")
    public Drill findById(@PathVariable UUID id) {
        return drillService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Drill> create(@Valid @RequestBody Drill drill) {
        Drill created = drillService.create(drill);
        return ResponseEntity.created(URI.create("/api/drills/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public Drill update(@PathVariable UUID id, @Valid @RequestBody Drill drill) {
        return drillService.update(id, drill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        drillService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
