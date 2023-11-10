package Data.API.controller;

import Data.API.model.FirstChart;
import Data.API.repository.FirstChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController

public class FirstChartController {
    @Autowired
    private FirstChartRepository firstChartRepository;

    @Autowired
    private ChartDescriptionController chartDescriptionController;

    public ResponseEntity<String> analyzeChart(HashMap<String, ArrayList<String>> content, String commandFile, String plotType) {

        ArrayList<String> selectedKey = new ArrayList<String>();

        for(String key: content.keySet()) {
            String tempKey = key.toLowerCase();
            if (commandFile.equals("Airline")) {
                if (tempKey.toLowerCase().contains("country") || tempKey.contains("departure") || tempKey.contains("airport")
                        || tempKey.contains("flight") || tempKey.contains("continent")) {
                    selectedKey.add(key);
                }
            }

            else if(commandFile.equals("Weather")) {
                if (tempKey.toLowerCase().contains("type") || tempKey.contains("temperature") || tempKey.contains("humidity")
                        || tempKey.contains("speed") || tempKey.contains("wind") || tempKey.contains("visibility") || tempKey.contains("pressure")) {
                    selectedKey.add(key);
                }
            }

            else if(commandFile.equals("Gaming")) {
                if (tempKey.toLowerCase().contains("champ") || tempKey.contains("winner") || tempKey.contains("ban")) {
                    selectedKey.add(key);
                }
            }
        }

        for(int j = 0; j < selectedKey.size(); j++) {
            ArrayList<String> firstVal = content.get(selectedKey.get(j));

            List<String> uniqueVal = firstVal.stream().distinct().collect(Collectors.toList());

            Integer[] count = new Integer[uniqueVal.size()];

            for(int i = 0; i < count.length; i++) {
                count[i] = 0;
            }

            for(String value: firstVal) {
                int index = uniqueVal.indexOf(value);
                count[index] += 1;
            }

            FirstChart newChart = new FirstChart(uniqueVal, count, selectedKey.get(j), commandFile.toLowerCase(), plotType);

            chartDescriptionController.addChartDescription(uniqueVal, count, selectedKey.get(j));

            firstChartRepository.save(newChart);

        }

        return new ResponseEntity<String>("Analyzed successfully!",HttpStatus.OK);
    }
    
}
