<?php

namespace TweedeGolf\VideoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class DefaultController.
 *
 * @Route("/admin/video")
 */
class DefaultController extends Controller
{
    /**
     * @Route("/browser")
     */
    public function indexAction()
    {
        return $this->render('TGVideoBundle:Default:index.html.twig', [
            'templates' => $this->getParameter('tg_video.templates'),
        ]);
    }
}
