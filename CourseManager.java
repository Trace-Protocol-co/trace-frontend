import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;

class Course {
    private String courseCode;
    private String courseTitle;
    private int unit;

    public Course(String courseCode, String courseTitle, int unit) {
        this.courseCode = courseCode.trim().toUpperCase();
        this.courseTitle = courseTitle.trim();
        this.unit = unit;
    }

    public String getCourseCode() { return courseCode; }
    public String getCourseTitle() { return courseTitle; }
    public int getUnit() { return unit; }

    @Override
    public String toString() {
        return String.format("%-12s | %-35s | %-5d", courseCode, courseTitle, unit);
    }
}

public class CourseManager {
    private ArrayList&lt;Course&gt; courses = new ArrayList&lt;&gt;();
    private final String filename = "courses.txt";
    private Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        CourseManager manager = new CourseManager();
        manager.displayMenuRecursive();
    }

    public void addCourse() {
        System.out.println("\n--- Add New Course ---");
        try {
            System.out.print("Enter Course Code (e.g., COS201): ");
            String code = scanner.nextLine().trim();
            if (code.isEmpty()) throw new IllegalArgumentException("Course code cannot be empty.");

            System.out.print("Enter Course Title: ");
            String title = scanner.nextLine().trim();
            if (title.isEmpty()) throw new IllegalArgumentException("Course title cannot be empty.");

            System.out.print("Enter Credit Units: ");
            String unitInput = scanner.nextLine().trim();
            if (!unitInput.matches("\\d+")) throw new IllegalArgumentException("Credit units must be a valid positive integer.");

            int unit = Integer.parseInt(unitInput);
            if (unit &lt;= 0) throw new IllegalArgumentException("Credit units must be greater than 0.");

            for (Course c : courses) {
                if (c.getCourseCode().equalsIgnoreCase(code)) {
                    System.out.println("Error: Course " + code.toUpperCase() + " already exists.");
                    return;
                }
            }

            courses.add(new Course(code, title, unit));
            System.out.println("Success: Course added successfully!");
        } catch (IllegalArgumentException e) {
            System.out.println("Input Error: " + e.getMessage());
        }
    }

    public void viewAllCourses() {
        System.out.println("\n--- Registered Courses ---");
        if (courses.isEmpty()) {
            System.out.println("No courses recorded yet.");
            return;
        }
        System.out.printf("%-12s | %-35s | %-5s\n", "Course Code", "Course Title", "Units");
        System.out.println("----------------------------------------------------------");
        for (Course course : courses) {
            System.out.println(course);
        }
    }

    private Course searchCourseRecursive(String code, int index) {
        if (index &gt;= courses.size()) return null;
        if (courses.get(index).getCourseCode().equalsIgnoreCase(code)) return courses.get(index);
        return searchCourseRecursive(code, index + 1);
    }

    public void runSearch() {
        System.out.println("\n--- Search Course by Code ---");
        if (courses.isEmpty()) {
            System.out.println("The system currently holds no courses to search.");
            return;
        }
        System.out.print("Enter Course Code to search: ");
        String code = scanner.nextLine().trim();
        Course result = searchCourseRecursive(code, 0);

        if (result != null) {
            System.out.println("\nMatch Found:");
            System.out.printf("%-12s | %-35s | %-5s\n", "Course Code", "Course Title", "Units");
            System.out.println("----------------------------------------------------------");
            System.out.println(result);
        } else {
            System.out.println("Course '" + code.toUpperCase() + "' was not found in the system.");
        }
    }

    public void computeTotalUnits() {
        System.out.println("\n--- Compute Total Units ---");
        int total = 0;
        for (Course c : courses) {
            total += c.getUnit();
        }
        System.out.println("Total Registered Courses: " + courses.size());
        System.out.println("Total Academic Credit Units: " + total);
    }

    public void saveToFile() {
        System.out.println("\n--- Save Data to File ---");
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename))) {
            for (Course course : courses) {
                writer.println(course.getCourseCode() + "," + course.getCourseTitle() + "," + course.getUnit());
            }
            System.out.println("Success: Saved " + courses.size() + " courses to '" + filename + "'.");
        } catch (IOException e) {
            System.out.println("File Output Error: Could not write data. " + e.getMessage());
        }
    }

    public void loadFromFile() {
        System.out.println("\n--- Load Data from File ---");
        File file = new File(filename);
        if (!file.exists()) {
            System.out.println("Notice: No data file found at '" + filename + "' to load from.");
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            courses.clear();
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    String[] tokens = line.split(",");
                    if (tokens.length == 3) {
                        courses.add(new Course(tokens[0], tokens[1], Integer.parseInt(tokens[2].trim())));
                    }
                }
            }
            System.out.println("Success: Loaded " + courses.size() + " courses from '" + filename + "'.");
        } catch (IOException | NumberFormatException e) {
            System.out.println("File Input Error: Data file may be corrupted. " + e.getMessage());
        }
    }

    public void displayMenuRecursive() {
        System.out.println("\n================================");
        System.out.println(" STUDENT COURSE MANAGEMENT SYSTEM");
        System.out.println("================================");
        System.out.println("1. Add Course");
        System.out.println("2. View All Courses");
        System.out.println("3. Search Course by Code");
        System.out.println("4. Compute Total Units");
        System.out.println("5. Save to File");
        System.out.println("6. Load from File");
        System.out.println("7. Exit Program");
        System.out.println("================================");
        System.out.print("Select an option (1-7): ");
        
        String choice = scanner.nextLine().trim();
        switch (choice) {
            case "1": addCourse(); break;
            case "2": viewAllCourses(); break;
            case "3": runSearch(); break;
            case "4": computeTotalUnits(); break;
            case "5": saveToFile(); break;
            case "6": loadFromFile(); break;
            case "7":
                System.out.println("\nThank you for using the Course Management System. Goodbye!");
                return;
            default:
                System.out.println("\nInvalid choice! Please select an option between 1 and 7.");
        }
        displayMenuRecursive();
    }