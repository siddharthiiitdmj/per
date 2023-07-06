# Aletheia
To run the application, run following commands in order : 

```
yarn install
yarn prisma generate
yarn dev
```

To get a lightweight GUI for viewing and editing database tables, run:
```
yarn prisma studio
```

### This week's goals:

- [x] a) Complete API integration for data entry in the Database, accessible via Postman.
- [x] b) Implement UI for the Integration Page, specifically for Slack and JIRA.
- [x] c) Display all attributes in Columns on the Events and Devices Tabs.
- [x] d) Optimize the Overview page by fetching pre-calculated metrics data from another API.
- [x] e) Present the data using a Bar Chart.
- [x] f) Implement background loading of Devices and Events data upon user login to ensure a smoother transition.
- [x] g) Create a detailed profile view for either User or Device (Either one of them is fine for this week). Show User device attributes and if the User is logged on to multiple devices.
- [x] h) Remove Tabs (Events and Devices) that don't have any data.
- [x] i) Remove the Users Tab.
- [ ] j) Ensure the User ID in Events is a number and not randomly generated.
- [ ] k) A pie chart that shows ratio by country.


