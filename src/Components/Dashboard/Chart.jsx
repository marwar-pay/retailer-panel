
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, title }) => {
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title || 'Chart',
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: '400px', padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Line data={data} options={options} />
    </Box>
  );
};

export default ChartComponent;
