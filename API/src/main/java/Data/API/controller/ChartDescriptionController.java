package Data.API.controller;

import Data.API.model.ChartDescription;
import Data.API.repository.ChartDescriptionRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/description")
public class ChartDescriptionController {

    public final int LIMIT = 3;

    @Autowired
    private ChartDescriptionRepository chartDescriptionRepository;

    @GetMapping
    private List<ChartDescription> getChartDescription() {
        return chartDescriptionRepository.findAll();
    }

    @GetMapping("/{category}")
    private ChartDescription getSingleChartDescription(@PathVariable String category) {
        return chartDescriptionRepository.findChartDescriptionByCategory(category);
    }

    public ResponseEntity<String> addChartDescription(List<String> data, Integer[] count, String category) {

        HashMap<String, Integer> tempData = new HashMap<String, Integer>();

        int total = 0;

        for(int i = 0; i < data.size(); i++) {
            total += count[i];
            tempData.put(data.get(i), count[i]);
        }

        Arrays.sort(count, Collections.reverseOrder());

        int limit = Math.min(count.length, LIMIT);

        List<String> topList = new ArrayList<String>();
        Float[] numbers = new Float[limit];

        for(int i = 0; i< limit; i++) {
            for(String key: tempData.keySet()) {
                if(tempData.get(key) == count[i]) {
                    topList.add(key);
                    numbers[i] = Float.valueOf(count[i]) / total * 100;
                }
            }
        }

        String description = "";

        if(numbers.length >= 3) {
            description += "The total number of records is " + String.valueOf(total) + ". The highest percentage of " + category + " is " + topList.get(0) + " with " +
                    String.valueOf(numbers[0]) + " % of total. The second highest percentage is " + topList.get(1) +
                    " with " + String.valueOf(numbers[1]) + " % of total. The third place belongs to " + topList.get(2)
                    + " with " + String.valueOf(numbers[2]) + " % of total.";
        } else {
            description += "The total number of records is " + String.valueOf(total) + ". The highest percentage of " + category + " is " + topList.get(0) + " with " +
                    String.valueOf(numbers[0]) + " % of total. The second highest percentage is " + topList.get(1) +
                    " with " + String.valueOf(numbers[1]) + " % of total.";
        }

        ChartDescription newChartDescription = new ChartDescription(category, description, topList, numbers);

        chartDescriptionRepository.save(newChartDescription);

        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

}
